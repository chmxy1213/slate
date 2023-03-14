<template>
    <div class="box">
        <div class="cover">
            <div class="cover-img"><img :src="musicDomInfo.cover_url"></div>
            <div class="music-info">
                <div class="music-name"><a href="">{{ musicDomInfo.name }}</a></div>
                <div class="music-artist"><a href="#">{{ musicDomInfo.artist }}</a></div>
            </div>
            <div class="fav-btn">
                <a href="#">
                    <img src="/fav.svg" style="width: 25px;height: 25px;"/>
                </a>
            </div>
        </div>
        <div class="player">
            <div class="play-controls">
                <div class="control">
                    <div class="button play-prev" title="上一首">
                        <i class="fa fa-step-backward" @click="upEvent"></i>
                    </div>
                </div>
                <div class="control">
                    <div class="button play-pause" title="播放">
                        <i alt="ggg" class="fa fa-play" :class="[playState.status ? playStyle.play : playStyle.pause]"
                            @click="playEvent"></i>
                    </div>
                </div>
                <div class="control">
                    <div class="button play-next" title="下一首">
                        <i class="fa fa-step-forward" @click="downEvent"></i>
                    </div>
                </div>
            </div>
            <div class="progress-box">
                <div class="now-time">{{ playState.cur_time }}</div>
                <div id="bar" class="all-bar a" @click="clickBarEvent">
                    <div class="progress-bar" :style="{ width: playState.play_progress + '%' }"></div>
                </div>
                <div class="all-time">{{ playState.dur_time }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { invoke } from "@tauri-apps/api/tauri";

// 播放栏状态
const playState = ref({
    status: false,      // 播放状态【暂停|播放】
    c_minutes: 0,       // 点击播放位置【分】
    c_seconds: 0,       // 点击播放位置【秒】
    cur_minutes: 0,     // 当前播放位置【分】
    cur_seconds: 0,     // 当前播放位置【秒】
    cur_time: "00:00",  // 当前时间【string】
    dur_seconds: 0,     // 音频总时长【秒】
    dur_minutes: 0,     // 音频总时长【分】
    dur_time: "00:00",  // 总时间【string】
    play_progress: 0,   // 音频播放进度
})
// 播放按钮样式：播放，暂停
const playStyle = ref({
    play: "fa-pause",
    pause: "fa-play",
});

// Audio对象
const audio = ref(null);

// TEST 歌曲信息数组[本地]
const musicList = ref([
    {
        name: "大笨钟",
        artist: "刘瑞琦",
        url: "/mp3/大笨钟-刘瑞琦.m4a",
        cover_url: "/cover/本草纲目.jpg"
    },
    {
        name: "简单爱",
        artist: "刘瑞琦",
        url: "/mp3/简单爱-刘瑞琦.m4a",
        cover_url: "/cover/感官先生.jpg"
    },
    {
        name: "夏天的风",
        artist: "刘瑞琦",
        url: "/mp3/夏天的风-刘瑞琦.m4a",
        cover_url: "/cover/我的名字.jpg"
    },
]);

/*=================================== 网络播放版本 ================================================*/
// TEST: 歌曲ID数组(歌曲列表)
const musicIDS = [65533, 65528, 1974443814, 65533, 65536, 28563317, 65538];
// TEST: 歌曲详情信息列表
const musicInfos = ref([]);
// TEST: 当前播放音乐信息
const currMusicInfo = ref({});
/*==============================================================================================*/


// TEST 当前歌曲在list中的索引位置
const musicIndex = ref({
    index: 0,
    max: musicList.value.length,
});

// TEST 绑定到dom上的歌曲名和歌曲作者
const musicDomInfo = ref({
    name: "",
    artist: "",
    cover_url: ""
});

// TEST: 获取歌曲url ["/song/url?id=33894312", "song/url/v1?id=33894312&level=exhigh", "/song/url/v1?id=405998841,33894312&level=lossless"]

// 点击播放条事件
function clickBarEvent(event) {
    // 进度条相对于左侧窗口的偏移量
    let barL = event.target.getBoundingClientRect().left;
    // 进度条相对于右侧窗口的偏移量
    let barR = event.target.getBoundingClientRect().right;
    // 播放进度条宽度 = 进度条相对于右侧窗口的偏移量 - 进度条相对于左侧窗口的偏移量
    let barWidth = barR - barL;
    // 鼠标的X坐标
    let mouseX = event.x;
    // 计算鼠标在进度条上的点击位置（当前鼠标的X坐标 - 进度条在窗口中的left位置）
    let clickPosition = mouseX - barL;
    // console.log(`总宽度：${barWidth}，鼠标坐标：${mouseX},点击位置：${clickPosition}`);

    // 计算歌曲进度
    playState.value.play_progress = (clickPosition / barWidth) * 100;
    // 计算歌曲时间并取整
    let currentTime = Math.floor(playState.value.play_progress / 100 * audio.value.duration);
    // console.log(`进度：${playState.value.play_progress}, 时间：${currentTime}`);
    audio.value.currentTime = currentTime;
}

// 播放事件
async function playEvent(_event) {
    playState.value.status = !playState.value.status;

    playState.value.status ? audio.value.play() : audio.value.pause();
}

// 上一首事件
function upEvent(_event) {
    if (musicIndex.value.index == 0) {
        return;
    }
    musicIndex.value.index--;
    audio.value.pause();
    audio.value.src = musicList.value[musicIndex.value.index].url;
    musicDomInfo.value.name = musicList.value[musicIndex.value.index].name;
    musicDomInfo.value.artist = musicList.value[musicIndex.value.index].artist;
    musicDomInfo.value.cover_url = musicList.value[musicIndex.value.index].cover_url;
    audio.value.play();
    playState.value.status = true;
}

// 下一首事件
function downEvent(_event) {
    if (musicIndex.value.index >= musicIndex.value.max) {
        return;
    }
    musicIndex.value.index++;
    audio.value.pause();
    audio.value.src = musicList.value[musicIndex.value.index].url;
    musicDomInfo.value.name = musicList.value[musicIndex.value.index].name;
    musicDomInfo.value.artist = musicList.value[musicIndex.value.index].artist;
    musicDomInfo.value.cover_url = musicList.value[musicIndex.value.index].cover_url;
    audio.value.play();
    playState.value.status = true;
}

// 更新当前音频播放时间
function updateCurTime() {
    // 当前播放时间【分】
    playState.value.cur_minutes = Math.floor(audio.value.currentTime / 60);
    // 当前播放时间【秒】
    playState.value.cur_seconds = Math.floor(audio.value.currentTime - playState.value.cur_minutes * 60);
    // 音频总时长【分】
    playState.value.dur_minutes = Math.floor(audio.value.duration / 60);
    // 音频总时长【秒】
    playState.value.dur_seconds = Math.floor(audio.value.duration - playState.value.dur_minutes * 60);

    if (playState.value.cur_minutes < 10) {
        playState.value.cur_minutes = '0' + playState.value.cur_minutes;
    }
    if (playState.value.cur_seconds < 10) {
        playState.value.cur_seconds = '0' + playState.value.cur_seconds;
    }
    if (playState.value.dur_minutes < 10) {
        playState.value.dur_minutes = '0' + playState.value.dur_minutes;
    }
    if (playState.value.dur_seconds < 10) {
        playState.value.dur_seconds = '0' + playState.value.dur_seconds;
    }

    // 设置播放时间 `NaN`: `Not a Number`
    if (isNaN(playState.value.cur_minutes) || isNaN(playState.value.cur_seconds)) {
        playState.value.cur_time = "00:00";
    } else {
        playState.value.cur_time = playState.value.cur_minutes + ':' + playState.value.cur_seconds;
    }
    // 设置总时长
    if (isNaN(playState.value.dur_minutes) || isNaN(playState.value.dur_seconds)) {
        playState.value.dur_time = '00:00';
    } else {
        playState.value.dur_time = playState.value.dur_minutes + ':' + playState.value.dur_seconds;
    }

    // 计算播放进度
    playState.value.play_progress = audio.value.currentTime / audio.value.duration * 100;

    // 播放完成恢复原样
    if (playState.value.play_progress == 100) {
        // 更改播放样式
        playState.value.play_progress = 0;
        playState.value.cur_time = "00:00";
        playState.value.status = false;
    }
}

/*==================================== version 2 =====================================*/
// TEST: 根据音乐ID获取歌曲详细信息
async function getMusicDetail(id) {
    let info = await invoke("get_music_detail", { id });
    if (info.code === 200) {
        return info.songs[0];
    } else {
        console.log(`请求音乐详情失败：${id}`);
    }
}

// TEST： 获取列表所有音乐的详细信息
async function getAllMusicDetail(ids) {
    await ids.forEach(async (id) => {
        let obj = await getMusicDetail(id);
        musicInfos.value.push(obj);
    });
}

// TEST: 设置默认播放音乐
async function setDefaultMusic() {
    setTimeout(async () => {
        // 设置当前音乐对象
        let _currMusicInfo = {
            id: musicInfos.value[0].id,
            name: musicInfos.value[0].name,
            dt: musicInfos.value[0].dt,
            picUrl: musicInfos.value[0].al.picUrl,
            url: "",
        };
        let musicUrlJson = await invoke("get_music_url", { id: _currMusicInfo.id });

        if (musicUrlJson.code !== 200) {
            console.log(`请求music url 失败! id: ${_currMusicInfo.id}`);
        } else {
            _currMusicInfo.url = musicUrlJson.data[0].url;
        }
        currMusicInfo.value = _currMusicInfo;
        console.log(`当前音乐: ${currMusicInfo.value}`);
        console.log(`当前音乐: ${JSON.stringify(currMusicInfo.value)}`);

        audio.value = new Audio();  // 创建音频对象
        audio.value.loop = false;   // 不循环播放
        console.log(JSON.stringify(currMusicInfo.value));
        // TODO
        // audio.value.src = currMusicInfo.value.url;
        audio.value.addEventListener("timeupdate", updateCurTime);
        musicDomInfo.value.name = currMusicInfo.value.name;
        musicDomInfo.value.artist = "空";  // TODO： 歌手还没做
        musicDomInfo.value.cover_url = currMusicInfo.value.picUrl;
    }, 1000);
}
/*===================================================================================*/

// 在此初始化
onBeforeMount(async () => {
    // 音频播放位置改变事件 v1
    // audio.value = new Audio();  // 创建音频对象
    // audio.value.loop = false;   // 不循环播放
    // audio.value.src = musicList.value[0].url;
    // audio.value.addEventListener("timeupdate", updateCurTime);
    // musicDomInfo.value.name = musicList.value[0].name;
    // musicDomInfo.value.artist = musicList.value[0].artist;
    // musicDomInfo.value.cover_url = musicList.value[0].cover_url;
    // v1 

    // v2
    // 请求音乐详情
    await getAllMusicDetail(musicIDS);
    await setDefaultMusic();
    // audio.value = new Audio();  // 创建音频对象
    // audio.value.loop = false;   // 不循环播放
    // console.log(JSON.stringify(currMusicInfo.value));
    // audio.value.src = currMusicInfo.value.url;
    // audio.value.addEventListener("timeupdate", updateCurTime);
    // musicDomInfo.value.name = currMusicInfo.value.name;
    // musicDomInfo.value.artist = "空";  // TODO： 歌手还没做
    // musicDomInfo.value.cover_url = currMusicInfo.value.picUrl;
    // v2
});

onMounted(() => {
});
</script>

<style lang="less" scoped>
@import url(https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css);

// Less 变量
@barHoverColor: #1db954;

.box {
    width: 100%;
    height: 100%;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    // border: 1px antiquewhite solid; // test

    .cover {
        display: flex;
        flex-direction: row;
        flex-grow: 0;
        justify-content: center;
        align-items: center;
        align-content: center;
        // border: 1px antiquewhite solid; // test
        float: left;

        .cover-img {
            width: 60px;
            height: 60px;
            // border-radius: 50%;
            // position: absolute;
            // box-shadow: 0px 0px 0px 5px #fff;
            overflow: hidden;
            transition: 0.3s ease;
            margin: 5px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .music-info {
            padding: 10px;

            .music-name {
                a {
                    color: #f7f7f7;
                }

                font-size: 15px;
                text-align: start;
            }

            .music-artist {
                a {
                    color: #999999;
                }

                font-size: 5px;
                text-align: start;
            }
        }
    }

    .player {
        display: flex;
        flex-direction: column;
        // border: 1px antiquewhite solid; // test
        text-align: center;
        justify-content: center;
        flex-grow: 1;

        .play-controls {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            // border-bottom: white 1px solid; // test

            .button {
                margin: 5px 0px 5px 0px;
                padding: 5px;
                cursor: pointer;
            }

            .control {
                font-size: 25px;
                display: flex;
                align-items: center;
            }

            .play-prev {
                margin-right: 30px;
            }

            .play-next {
                margin-left: 30px;
            }
        }

        .progress-box {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-grow: 1;

            // background-color: aliceblue;
            .now-time {
                margin-right: 10px;
            }

            .all-time {
                margin-left: 10px;
            }

            .all-bar {
                width: 40%;
                background-color: #5e5e5e;
                height: 4px;
                border-radius: 4px;
                // z-index: auto;
                position: relative;
                cursor: pointer;

                .progress-bar {
                    width: 10%;
                    background-color: #fbfbfb;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1;
                    height: 4px;
                    border-radius: 4px;
                    transition: width 0.1s ease;
                    pointer-events: none; // 禁用鼠标事件
                }
            }

            .all-bar:hover {
                .progress-bar {
                    background-color: @barHoverColor;
                    transition: .5s ease;
                }
            }
        }
    }
}</style>