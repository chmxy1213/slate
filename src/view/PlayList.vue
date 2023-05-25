<!-- 歌单组件 -->
<!-- 根据路由参数选择加载模式(type: ["top": "榜单", "normal": "一般歌单", "custom": "自定义歌单"]) -->
<template>
    <div class="playlist-container">
        <canvas id="canvas" style="display: none;"></canvas>
        <!-- 页面头 -->
        <div class="playlist-header">
            <div class="cover">
                <div v-if="route.query.type == 'custom'">
                    <div v-if="songsData.length > 4" class="four-img">
                        <img :src="songsData[0].picUrl">
                        <img :src="songsData[1].picUrl">
                        <img :src="songsData[2].picUrl">
                        <img :src="songsData[3].picUrl">
                    </div>
                    <div v-else-if="songsData.length == 1">
                        <img :src="songsData[0].picUrl">
                    </div>
                    <div v-else style="background-color: #494949;padding: 10px;">
                        <font-awesome-icon :icon="['fas', 'music']" style="width:100px;height:100px;" />
                        <font-awesome-icon :icon="['fas', 'music']" />
                    </div>
                </div>
                <img v-else id="cover" crossorigin="anonymous" :src="headerData.coverImgUrl">
            </div>
            <div class="section-two">
                <div class="playlist-name">
                    <p>{{ headerData.name }}</p>
                </div>
                <div class="playlist-description">
                    <span v-if="headerData.description.length > 150">{{ headerData.description.slice(0, 150) + '...'
                    }}</span>
                    <span v-else>{{ headerData.description }}</span>
                </div>
                <div class="playlist-playcount">
                    <p>播放&nbsp;{{ headerData.playCount }}&nbsp;次</p>
                </div>
            </div>
        </div>
        <!-- 页面体 -->
        <div class="playlist-body">
            <div class="btns">
                <div class="btn-play">
                    <i class="fa fa fa-play"></i>
                </div>
            </div>
            <Table :header="tableHeader" :data="songsData" :events="[dbPlayEvent, likeEvent, addToQueueEvent]" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { invoke } from "@tauri-apps/api";
import Table from "../components/table/Table.vue";
import { useRoute } from "vue-router";
import { useTopListStore } from "../stores/topList";
import { usePlayQueueStore } from "../stores/playQueue";
import { usePlayListStore } from "../stores/playList";
import { useSysStore } from "../stores/sys";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user";
import { likeMusicOrNot } from "../tools/user";
import { getMDPromise, ARRS } from "../tools/req";

const { topLists } = useTopListStore();
const { add, playThis } = usePlayQueueStore();
const { playListData } = usePlayListStore();
const { scrollToBottom } = storeToRefs(useSysStore());
const { user } = useUserStore();

const route = useRoute();

const headerData = ref({
    name: "",
    coverImgUrl: "",
    description: "",
    playCount: 0,
});
const songsData = ref([]);
const tableHeader = ["#", "标题", "专辑", "时长"];

// TODO: this fucntion is some same with `req.js`.
// process the request's data
// Require: id, name, picUrl, artists, album, time
function processData(_data) {
    let tmp = [];
    _data.forEach((value) => {
        // Process artists
        let ars = "";  // Artist String
        value.ar.forEach((value) => {
            ars += `,${value.name}`;
        });
        ars = ars.replace(/^(\s|,)+|(\s|,)+$/g, '');
        // Process duration
        let dt_s = Math.floor(value.dt / 1000);
        let time_min = Math.floor(dt_s / 60);
        let time_s = Math.floor(dt_s - (time_min * 60));
        let time_string = time_min + ':' + time_s;
        tmp.push({
            id: value.id,
            name: value.name,
            picUrl: value.al.picUrl,
            artists: ars,
            album: value.al.name,
            time: time_string,
        });
    });
    return tmp;
}

// compute imgage's theme color
function comClr() {
    let canvas = document.getElementById("canvas");
    let img = document.getElementById("cover");
    canvas.width = img.width;
    canvas.height = img.height;

    let context = canvas.getContext("2d");

    context.drawImage(img, 0, 0, img.width, img.height);

    // 获取像素数据
    let imageData = context.getImageData(0, 0, img.width, img.height).data;

    let r = 1, g = 1, b = 1;
    // 取所有像素的平均值
    for (var row = 0; row < img.height; row++) {
        for (var col = 0; col < img.width; col++) {
            // console.log(data[((img.width * row) + col) * 4])
            if (row == 0) {
                r += imageData[((img.width * row) + col)];
                g += imageData[((img.width * row) + col) + 1];
                b += imageData[((img.width * row) + col) + 2];
            } else {
                r += imageData[((img.width * row) + col) * 4];
                g += imageData[((img.width * row) + col) * 4 + 1];
                b += imageData[((img.width * row) + col) * 4 + 2];
            }
        }
    }

    // 求取平均值
    r /= (img.width * img.height);
    g /= (img.width * img.height);
    b /= (img.width * img.height);

    // 将最终的值取整
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);

    document.getElementsByClassName("playlist-header")[0].style.background = `linear-gradient(rgba(${r}, ${g}, ${b}, 1), rgba(${r}, ${g}, ${b}, 0.3))`;
    document.getElementsByClassName("playlist-body")[0].style.background = `linear-gradient(rgba(${r}, ${g}, ${b}, 0.5), #121212)`;
}

// scroll to bottom task
async function task() {
    // Request data
    // check if songs length is less than this top list's length
    if (songsData.value.length < headerData.value.trackCount) {
        let res = await invoke("get_playlist_all_music", { id: route.query.id * 1, limit: 30, offset: songsData.value.length });
        if (res.code == 200) {
            songsData.value = songsData.value.concat(processData(res.songs));
        }
    }
}

// 滚动加载监听
watch(scrollToBottom, async (val, oldval) => {
    if (val == true && oldval == false) {
        await task();
    }
});

// 路由监听，确保路由query变化更新数据
watch(route, async (val, _) => {
    await loadCustomListData(val.query.id * 1, user.token);
});

// double click play event
async function dbPlayEvent(id) {
    await add(id, 0);
    await playThis(0);
}

// like event
async function likeEvent(id, flag) {
    await likeMusicOrNot(id, flag);
}

// add to queue event
async function addToQueueEvent(id) {
    await add(id, -1);
}

/**
 * @description 加载top list的数据
 * @param {Number} id top list的id
 */
async function loadTopListData(id) {
    topLists.data.forEach((value) => {
        if (value.id == route.query.id) {
            headerData.value = value;
        }
    });
    let hitPlayListData = false;
    playListData.forEach((value) => {
        if (value.id == route.query.id) {
            songsData.value = value.items;
            hitPlayListData = true;
        }
    });
    if (!hitPlayListData) {
        playListData.push({
            id: route.query.id,
            items: [],
        });
        songsData.value = playListData[playListData.length - 1].items;
    }
    if (!hitPlayListData || songsData.value.length == 0) {
        let res = await invoke("get_playlist_all_music", { id, limit: 30, offset: 0 });
        if (res.code === 200) {
            songsData.value = processData(res.songs);
        }
    }
}

/**
 * @description 加载normal list的数据
 * @param {Number} id normal list的id
 */
async function loadNornmalListData(id) {
    // 请求歌曲详情数据
    let res = await invoke("get_playlist_detail", { id });
    // 构造 headerData并赋值给 `headerData`
    if (res.code == 200) {
        headerData.value = res.playlist;
    } else {
        return;
    }
    // 请求歌单所有歌曲
    let resALlMusic = await invoke("get_playlist_all_music", {
        id,
        limit: 30,
        offset: 0,
    });
    // 解析歌曲数据
    // 并将数据赋值到 `songsData`
    if (resALlMusic.code == 200) {
        songsData.value = processData(resALlMusic.songs);
    }
}

/**
 * @description 加载自定义歌单数据
 * @param {Number} id 自定义歌单的id
 * @param {String} token 用户的token
 */
async function loadCustomListData(id, token) {
    let [res, err] = await invoke("get_allsong_playlist", { token, id })
        .then(res => [res, null])
        .catch(err => [null, err]);
    if (err === null) {
        headerData.value = {
            name: res.data.playlist.name === "__LIKE__" ? "我喜欢的音乐" : res.data.playlist.name,
            // coverImgUrl: data.data.playlist.coverImgUrl,
            coverImgUrl: "",
            description: "",
            playCount: res.data.playlist.playCount,
        }
        if (res.data.songIds.length === 0) {
            console.log("empty playlist");
            return;
        } else {
            let datas = await ARRS(res.data.songIds, getMDPromise);
            songsData.value = processData(datas);
            headerData.value.coverImgUrl = songsData.value[0].picUrl;
        }
    } else {
        console.log(err);
    }
}

onBeforeMount(async () => {
    let _type = route.query.type;
    if (_type == "top") {
        await loadTopListData(route.query.id * 1);
    } else if (_type == "normal") {
        await loadNornmalListData(route.query.id * 1);
    } else if (_type == "custom") {
        await loadCustomListData(route.query.id * 1, user.token);
    }
    // BUG coumpute image's theme color
    // comClr();
});
</script>

<style scoped lang="less">
.playlist-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .playlist-header {
        display: flex;
        flex-direction: row;
        // background-color: #457394;
        background: linear-gradient(to bottom right, #3f13b9, #7b9187);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        backdrop-filter: saturate(50%) blur(6px);

        .cover {
            .four-img {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
                grid-column-gap: 0px;
                grid-row-gap: 0px;

                img {
                    width: 100px;
                    height: 100px;
                }
            }

            img {
                width: 200px;
                height: 200px;
            }

            padding: 20px;
        }

        .section-two {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 22px;

            .playlist-name {
                margin-bottom: 10px;

                p {
                    font-size: 35px;
                    line-height: 40px;
                    font-weight: 900;
                }
            }

            .playlist-description {
                margin-top: 10px;
                margin-bottom: 10px;

                span {
                    display: inline-block;
                    font-size: 14px;
                    color: #b3b3b3;
                }
            }
        }
    }

    .playlist-body {
        display: flex;
        flex-direction: column;
        // background: linear-gradient(#213646, #121212);
        padding-left: 20px;
        padding-right: 20px;

        .btns {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 20px;

            .btn-play {
                width: 50px;
                height: 50px;
                background-color: #1fdf64;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                i {
                    color: #000;
                    font-size: 20px;
                }
            }
        }
    }
}
</style>