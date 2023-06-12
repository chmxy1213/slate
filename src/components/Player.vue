<template>
    <div class="box">
        <div class="cover">
            <div class="cover-img">
                <img v-if="music.info.picUrl" id="cover" :src="music.info.picUrl" @load="imgLoaded" @error="imgError">
                <span v-else class="img-err"></span>
            </div>
            <div class="music-info">
                <div class="music-name">
                    <a v-if="music.info.name.length >= 10" href="javascript:;">{{ music.info.name.slice(0, 10) + '...'
                    }}</a>
                    <a v-else href="javascript:;">{{ music.info.name }}</a>
                </div>
                <div class="music-artist">
                    <a v-if="music.info.artists.length >= 10" href="javascript:;">{{ music.info.artists.slice(0, 10) + '...'
                    }}</a>
                    <a v-else href="javascript:;">{{ music.info.artists }}</a>
                </div>
            </div>
            <div class="fav-btn">
                <a href="#">
                    <font-awesome-icon v-if="checkLikeMusic(music.info.id)" :icon="['fas', 'heart']"
                        style="color: #1fdf64;" />
                    <img v-else src="/fav.svg" style="width: 25px;height: 25px;" 
                    @click="likeEvent(music.info.id, checkLikeMusic(music.info.id))"/>

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
                        <i alt="ggg" class="fa fa-play" :class="[music.playStatus ? playStyle.play : playStyle.pause]"
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
        <div class="tools">
            <div class="volume-value" :class="[playState.volumeValueShow ? '' : 'volume-value-none']">
                <p v-if="playState.volume < 80" style="color:#1fdf64;">{{ playState.volume }}%</p>
                <p v-else style="color:red">{{ playState.volume }}%</p>
            </div>
            <div id="id-volume" class="volume" :title="'音量:' + playState.volume" @click="muteEvent" 
                @mouseenter="playState.volumeValueShow = true"
                @mouseleave="playState.volumeValueShow = false">
                <!-- <img class="icon" src="/svg/volume.svg" alt="音量调节"> -->
                <font-awesome-icon v-if="playState.volume == 0" :icon="['fas', 'volume-xmark']" />
                <font-awesome-icon v-else-if="playState.volume <= 80" :icon="['fas', 'volume-low']" />
                <font-awesome-icon v-else :icon="['fas', 'volume-high']" />
            </div>
            <div class="play-list" title="播放列表" @click="goPlayQueue">
                <img class="icon" src="/svg/list-icon.svg" alt="播放列表">
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMusicStore } from "../stores/music.js";
import { usePlayQueueStore } from "../stores/playQueue";
import { checkLikeMusic, updateCustomPlaylist } from "../tools/user";

const router = useRouter();
const { music, load, play, pause } = useMusicStore();
const { previous, next } = usePlayQueueStore();

// 播放栏状态
const playState = ref({
    volumeValueShow: false,  // 音量百分比显示
    volume: 50,         // 音量百分比
    volumeBefore: 50,   // 静音之前的音量
    c_minutes: 0,       // 点击播放位置【分】
    c_seconds: 0,       // 点击播放位置【秒】
    cur_minutes: 0,     // 当前播放位置【分】
    cur_seconds: 0,     // 当前播放位置【秒】
    cur_time: "00:00",  // 当前时间【string】
    dur_seconds: 0,     // 音频总时长【秒】
    dur_minutes: 0,     // 音频总时长【分】
    dur_time: "00:00",  // 总时间【string】
    play_progress: 0,   // 音频播放进度
});

// 播放按钮样式：播放，暂停
const playStyle = ref({
    play: "fa-pause",
    pause: "fa-play",
});

// 播放队列切换标记: 位于播放队列为true
const playQueueSwitch = ref(false);

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
    let currentTime = Math.floor(playState.value.play_progress / 100 * music.audio.duration);
    // console.log(`进度：${playState.value.play_progress}, 时间：${currentTime}`);
    // audio.value.currentTime = currentTime;
    music.audio.currentTime = currentTime;
}


// 播放事件
function playEvent() {
    music.playStatus = !music.playStatus;
    if (music.playStatus) {
        play();
    } else {
        pause();
    }
}

// 上一首事件
async function upEvent() {
    await previous();
}

// 下一首事件
async function downEvent() {
    await next();
}

// 更新当前音频播放时间
async function updateCurTime() {
    // 当前播放时间【分】
    playState.value.cur_minutes = Math.floor(music.audio.currentTime / 60);
    // 当前播放时间【秒】
    playState.value.cur_seconds = Math.floor(music.audio.currentTime - playState.value.cur_minutes * 60);
    // 音频总时长【分】
    playState.value.dur_minutes = Math.floor(music.audio.duration / 60);
    // 音频总时长【秒】
    playState.value.dur_seconds = Math.floor(music.audio.duration - playState.value.dur_minutes * 60);

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
    playState.value.play_progress = music.audio.currentTime / music.audio.duration * 100;

    // 播放完成恢复原样
    if (playState.value.play_progress == 100) {
        // 更改播放样式
        playState.value.play_progress = 0;
        playState.value.cur_time = "00:00";
        music.playStatus = false;

        // 播放完成自动下一首
        await next();
    }
}

// 播放列表点击事件
function goPlayQueue() {
    if (playQueueSwitch.value) {
        router.back();
    } else {
        router.push({ name: "playQueue" });
    }
    playQueueSwitch.value = !playQueueSwitch.value;
}

// 静音事件
function muteEvent() {
    console.log("mete event");
    if (playState.value.volume == 0) {
        playState.value.volume = playState.value.volumeBefore;
    } else {
        playState.value.volumeBefore = playState.value.volume;
        playState.value.volume = 0;
    }
    music.audio.volume = playState.value.volume / 100.0;
}

// 滚轮调节音量
function changeVolumeEvent(event) {
    playState.value.volumeValueShow = true;
    if (event.deltaY == -125 && playState.value.volume < 100) {
        playState.value.volume += 5;
    } else if (event.deltaY == 125 && playState.value.volume > 0) {
        playState.value.volume -= 5;
    }
    music.audio.volume = playState.value.volume / 100.0;
    setTimeout(() => {
        playState.value.volumeValueShow = false;
    }, 1000);
}

// 喜欢或取消喜欢音乐
async function likeEvent(id, flag) {
    await updateCustomPlaylist(0, id, flag, true);
}

// 在此初始化
onBeforeMount(() => {
    let interval = setInterval(() => {
        if (music.audio !== null) {
            music.audio.addEventListener("timeupdate", updateCurTime);
            clearInterval(interval);
        }
    }, 100);

});

onMounted(() => {
    // document.getElementById("cover").onload = imgLoaded;
    let volumeDom = document.getElementById("id-volume");
    volumeDom.addEventListener("mousewheel", changeVolumeEvent);
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
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

    .cover {
        position: absolute;
        left: 0;
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

            .img-err {
                display: inline-block;
                width: 100%;
                height: 100%;
                background: #f2f2f2;
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
        text-align: center;
        justify-content: center;
        flex-grow: 1;

        .play-controls {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: c1enter;

            .control {
                font-size: 25px;
                display: flex;
                align-items: center;
                padding: 1px;
                margin: 0;

                .button {
                    margin: 5px 0px 5px 0px;
                    padding: 5px;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                }
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

            .now-time {
                margin-right: 10px;
            }

            .all-time {
                margin-left: 10px;
            }

            .all-bar {
                width: 30%;
                background-color: #5e5e5e;
                height: 5px;
                border-radius: 4px;
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

    .tools {
        position: absolute;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .volume-value {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 5px;
        }

        .volume-value-none {
            opacity: 0;
            transition: ease 0.8s;
        }

        .volume {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            width: 30px;

            .icon {
                width: 28px;
                height: 28px;
            }

            margin-right: 10px;
        }

        .play-list {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            .icon {
                width: 28px;
                height: 28px;
            }

            margin-right: 10px;
        }
    }
}
</style>