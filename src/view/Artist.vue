<!-- 歌手详情页 -->
<template>
    <div class="artist-container">
        <canvas id="canvas" style="display: none;"></canvas>
        <!-- 页面头 -->
        <div class="artist-header" :style="{ background: data.artist.img1v1Url }">
            <div class="header-box">
                <div class="cover">
                    <img id="cover" crossorigin="anonymous" :src="data.artist.picUrl">
                </div>
                <div class="section-two">
                    <div class="artist-name">
                        <p>{{ data.artist.name }}</p>
                    </div>
                    <div class="artist-description">
                        <span v-if="data.artist.briefDesc.length > 200">{{ data.artist.briefDesc.slice(0, 100) + '...'
                        }}</span>
                        <span v-else>{{ data.artist.briefDesc }}</span>
                    </div>
                    <div class="sizes">
                        <div>
                            <span>歌曲：&nbsp;{{ data.artist.musicSize }}&nbsp;首,&nbsp;</span>
                        </div>
                        <div>
                            <span>专辑：&nbsp;{{ data.artist.albumSize }}&nbsp;张&nbsp;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="types">
            <div class="item" :class="{ 'active': index == typeState }" v-for="(item, index) in types" :key="index"
                @click="typeState = index">
                <span>{{ item }}</span>
            </div>
        </div>
        <!-- 页面体 -->
        <div class="artist-body">
            <div class="hot-songs" v-show="typeState == 0 || typeState == 1">
                <div class="btns">
                    <div class="btn-play">
                        <i class="fa fa fa-play"></i>
                    </div>
                </div>
                <div class="table-container">
                    <div class="table-title">
                        <div class="title-one">
                            <span class="idx">{{ header[0] }}</span>
                            <span>{{ header[1] }}</span>
                        </div>
                        <div class="title-two">
                            <span>{{ header[2] }}</span>
                        </div>
                        <div class="title-three">
                            <span>{{ header[3] }}</span>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="table-body">
                        <div class="table-item" v-for="(item, index) in songs">
                            <div class="table-item-container" @dblclick="dbPlayEvent(item.id)">
                                <div class="block-one">
                                    <div class="index">
                                        <span class="id">{{ index + 1 }}</span>
                                        <span class="index-icon" @click="dbPlayEvent(item.id)">
                                            <i class="fa fa-play fa-play" />
                                        </span>
                                    </div>
                                    <div class="cover" v-if="item.picUrl">
                                        <img :src="item.picUrl">
                                    </div>
                                    <div class="info">
                                        <div class="name">
                                            <!-- Check length -->
                                            <p v-if="item.name.length > 20">{{ item.name.slice(0, 20) + "..." }}</p>
                                            <p v-else>{{ item.name }}</p>
                                        </div>
                                        <div class="artists">
                                            <!-- Check length -->
                                            <p v-if="item.artists.length > 20">{{ item.artists.slice(0, 20) + "..." }}</p>
                                            <p v-else>{{ item.artists }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="block-two">
                                    <p>{{ item.album }}</p>
                                </div>
                                <div class="block-three">
                                    <p>{{ item.time }}</p>
                                </div>
                                <!-- hover icons -->
                                <div class="hover-icons">
                                    <div class="icon" @click="likeEvent(item.id)">
                                        <font-awesome-icon :icon="['fas', 'heart']" style="color: #fff;" />
                                    </div>
                                    <div class="icon" @click="addToQueueEvent(item.id)">
                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="album" v-show="typeState == 2">
                <div class="inner-albums-container">
                    <div class="album-card" v-for="item in data.albums" :key="item.id"
                        @click="router.push({ name: 'album', query: { id: item.id } })">
                        <div class="cover">
                            <img :src="item.picUrl">
                        </div>
                        <div class="info">
                            <div class="name">
                                <span v-if="item.name.length >= 10">{{ item.name.slice(0, 9) + '...' }}</span>
                                <span v-else>{{ item.name }}</span>
                            </div>
                            <div class="row-2">
                                <div class="publish-time">
                                    <span>{{ timestampToDate(item.publishTime) }}·专辑</span>
                                </div>
                                <div class="size">
                                    <span>{{ item.size }}首歌曲</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlayQueueStore } from "../stores/playQueue";
import { invoke } from "@tauri-apps/api";
import { useSysStore } from "../stores/sys";
import { storeToRefs } from "pinia";

const { add, playThis } = usePlayQueueStore();
const { scrollToBottom } = storeToRefs(useSysStore());
const route = useRoute();
const router = useRouter();

const header = ["#", "标题", "专辑", "时长"];
const data = ref({
    artist: {
        id: 0,
        name: "",
        picUrl: "",
        img1v1Url: "",
        musicSize: 0,
        albumSize: 0,
        briefDesc: "",
        publishTime: 0,
    },
    hotSongs: [],
    allSongs: [],
    albums: [],
});
const songs = ref([]);
const typeState = ref(0);
const types = ["热门歌曲", "所有歌曲", "专辑"];

// Request data and process data
async function get(id) {
    let res = await invoke("get_artist_common_detail", { id });
    if (res.code == 200) {
        data.value.artist = res.artist;
        data.value.hotSongs = res.hotSongs;
    }
}

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
        if (time_s < 10) {
            time_s = '0' + time_s;
        }
        let time_string = time_min + ':' + time_s;
        // push to songs state
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

// double click play event
async function dbPlayEvent(id) {
    await add(id, 0);
    await playThis(0);
}

// like event
function likeEvent(id) {
    // TODO
    console.log(`like ${id}`);
}

// add to queue event
async function addToQueueEvent(id) {
    // TODO
    console.log(`add to queue ${id}`);
    await add(id, -1);
}

// timestamp transform to date(YYYYD)
function timestampToDate(timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    // let month = date.getMonth() + 1;
    // let day = date.getDate();
    return `${year}`;
}

// 监听显示类型
watch(typeState, async () => {
    if (typeState.value == 0) {
        songs.value = data.value.hotSongs;
    } else if (typeState.value == 1) {
        if (data.value.allSongs.length == 0) {
            let res = await invoke("get_artist_all_songs", { id: data.value.artist.id, limit: 40, offset: 0 });
            if (res.code == 200) {
                data.value.allSongs = res.songs;
                let songs_tmp = processData(res.songs);
                data.value.allSongs = songs_tmp;
                songs.value = songs_tmp;
            }
        } else {
            songs.value = data.value.allSongs;
        }
    } else if (typeState.value == 2) {
        if (data.value.albums.length == 0) {
            let res = await invoke("get_artist_all_albums", { id: data.value.artist.id, limit: 30, offset: 0 });
            if (res.code == 200) {
                data.value.albums = res.hotAlbums;
            }
        }
    }
});

// 监听父组件的滚动事件状态
watch(scrollToBottom, async (newVal, oldVal) => {
    console.log('触发监听事件');
    if (newVal == true && oldVal == false) {
        console.log('触发 scroll 事件');
        // 所有歌曲
        if (typeState.value == 1 && data.value.allSongs.length < data.value.artist.musicSize) {
            console.log('所有歌曲加载更多');
            let res = await invoke("get_artist_all_songs", { id: data.value.artist.id, limit: 30, offset: data.value.allSongs.length });
            console.log(res);
            if (res.code == 200) {
                let proces_res = processData(res.songs);
                data.value.allSongs = data.value.allSongs.concat(proces_res);
                songs.value = data.value.allSongs;
                console.log(data.value.allSongs);
            }
        }
        // 所有专辑
        else if (typeState.value == 2 && data.value.albums.length < data.value.artist.albumSize) {
            console.log('所有专辑加载更多');
            let res = await invoke("get_artist_all_albums", { id: data.value.artist.id, limit: 30, offset: data.value.albums.length });
            console.log(res);
            if (res.code == 200) {
                data.value.albums = data.value.albums.concat(res.hotAlbums);
                console.log(data.value.albums);
            }
        }
    }
});

onBeforeMount(async () => {
    let id = route.query.id;
    // TODO
    await get(id * 1);
    console.log(data.value);
    let songs_tmp = processData(data.value.hotSongs);
    data.value.hotSongs = songs_tmp;
    songs.value = songs_tmp;
});

// onMounted(() => {
//     let head = document.getElementsByClassName("artist-header")[0];
//     console.log(data.value.artist.img1v1Url);
//     head.style.backgroundImage = `url(${data.value.artist.img1v1Url})`;
// });
</script>

<style lang="less" scoped>
.artist-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    //TODO: 优化滚动条和导航栏
    // margin-top: 60px;
    // overflow-y: scroll;

    .artist-header {
        position: relative;
        display: flex;
        background-color: #457394;
        // TEST
        // background: url("/cover/夜曲.jpg");
        // background-size: cover;

        .header-box {
            z-index: 1;
            display: flex;
            flex-direction: row;

            .cover {
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

                .artist-name {
                    margin-bottom: 10px;

                    p {
                        font-size: 35px;
                        font-weight: 900;
                    }
                }

                .artist-description {
                    margin-top: 10px;
                    margin-bottom: 10px;

                    span {
                        display: inline-block;
                        font-size: 14px;
                        color: #b3b3b3;
                    }
                }

                .sizes {
                    display: flex;
                    flex-direction: row;

                    span {
                        display: inline-block;
                        font-size: 14px;
                        color: #b3b3b3;
                    }
                }

            }
        }
    }

    // TEST 背景高斯模糊
    // .artist-header::before {
    //     z-index: 0;
    //     content: "";
    //     position: absolute;
    //     width: 100%;
    //     height: 100%;
    //     backdrop-filter: blur(40px);
    // }

    .types {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
        margin-left: 30px;
        margin-bottom: 20px;
        // border: 1px solid;

        .item {
            padding: 8px;
            background-color: #2a2a2a;
            border-radius: 10px;
            margin: 0 20px 0 0;
            color: #fff;
            font-size: 13px;
            font-weight: 800;
        }

        .active {
            background-color: #fff;
            color: #2a2a2a;
            transition: .2s ease;
        }
    }

    .artist-body {
        display: flex;
        flex-direction: column;
        // background: linear-gradient(#213646, #121212);
        padding-left: 20px;
        padding-right: 20px;

        .hot-songs {
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

            .table-container {
                display: flex;
                flex-direction: column;
                width: 100%;

                .table-title {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: 1fr;
                    grid-column-gap: 0px;
                    grid-row-gap: 0px;
                    margin-top: 3px;
                    margin-bottom: 3px;

                    .title-one {
                        grid-area: 1 / 1 / 2 / 3;
                        margin-left: 20px;

                        .idx {
                            display: inline-block;
                            margin-right: 38px;
                        }
                    }

                    .title-two {
                        grid-area: 1 / 3 / 2 / 4;
                    }

                    .title-three {
                        display: flex;
                        justify-content: flex-end;
                        grid-area: 1 / 4 / 2 / 5;
                    }
                }

                .line {
                    width: 100%;
                    height: 1px;
                    background-color: #30383d;
                    margin-bottom: 10px;
                }

                .table-body {
                    .table-item {
                        .table-item-container {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            grid-template-rows: 1fr;
                            grid-column-gap: 0px;
                            grid-row-gap: 0px;
                            padding: 5px;
                            color: #b3b3b3;

                            .block-one {
                                grid-area: 1 / 1 / 2 / 3;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                flex-direction: row;
                                margin-left: 10px;

                                .index {
                                    display: flex;
                                    align-items: center;
                                    margin: 2px;
                                    width: 32px;
                                    height: 32px;

                                    .index-icon {
                                        display: none;
                                    }
                                }

                                .cover {
                                    display: flex;
                                    align-items: center;
                                    margin: 2px;
                                    margin-left: 20px;

                                    img {
                                        width: 50px;
                                        height: 50px;
                                    }
                                }

                                .info {
                                    display: flex;
                                    align-items: flex-start;
                                    margin: 2px;
                                    flex-direction: column;
                                    margin-left: 20px;

                                    .name {
                                        display: flex;
                                        color: #fff;
                                        font-size: 15px;
                                    }

                                    .artists {
                                        display: flex;
                                        // color: #b3b3b3;
                                        font-size: 12px;
                                    }
                                }
                            }

                            .block-two {
                                grid-area: 1 / 3 / 2 / 4;
                                display: flex;
                                align-items: center;
                                margin: 2px;
                            }

                            .block-three {
                                grid-area: 1 / 4 / 2 / 5;
                                display: flex;
                                align-items: center;
                                justify-content: flex-end;
                                margin: 2px;
                            }

                            .hover-icons {
                                display: none;

                                .icon {
                                    display: none;
                                }
                            }
                        }

                        .table-item-container:hover {
                            position: relative;
                            border-radius: 10px;
                            background-color: #2a2a2a;
                            cursor: pointer;
                            opacity: 1;
                            color: #fff;

                            .block-one {
                                .index {
                                    .id {
                                        display: none !important;
                                    }

                                    .index-icon {
                                        display: inline !important;
                                    }
                                }
                            }

                            .hover-icons {
                                position: absolute;
                                right: 50px;
                                top: 0;
                                bottom: 0;
                                margin: auto;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                .icon {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    color: #fff;
                                    width: 25px;
                                    height: 25px;
                                    margin: 0px 5px 0px 5px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .album {
            .inner-albums-container {
                display: flex;
                justify-content: space-around;
                align-items: flex-start;
                flex-wrap: wrap;
                align-content: flex-start;
                width: 100%;
                height: 100%;

                .album-card {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-direction: column;
                    margin: 10px;
                    background-color: #2a2a2a;
                    border-radius: 5px;
                    padding: 10px;

                    .cover {
                        img {
                            width: 150px;
                            height: 150px;
                            border-radius: 5px;
                            margin-bottom: 20px;
                            margin-top: 10px;
                        }
                    }

                    .info {
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        flex-direction: column;
                        width: 150px;

                        .name {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #fff;
                            font-size: 15px;
                            margin-bottom: 10px;
                            font-weight: bolder;
                        }

                        .row-2 {
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            align-items: center;
                            color: #b3b3b3;
                            font-size: 12px;
                            font-weight: bolder;
                        }
                    }
                }

                .album-card:hover {
                    cursor: pointer;
                    background-color: #434242;
                    transition: .5s;
                    filter: drop-shadow(0px 0px 5px #b3b3b3);

                    .cover {
                        animation: swing .2s;
                    }
                }
            }
        }
    }
}

@keyframes swing {
    0% {
        transform: rotate(0deg);
    }

    10% {
        transform: rotate(3deg);
    }

    25% {
        transform: rotate(5deg);
    }

    35% {
        transform: rotate(3deg);
    }

    50% {
        transform: rotate(0deg);
    }

    60% {
        transform: rotate(-3deg);
    }

    75% {
        transform: rotate(-5deg);
    }

    85% {
        transform: rotate(-3deg);
    }

    100% {
        transform: rotate(0deg);
    }
}
</style>