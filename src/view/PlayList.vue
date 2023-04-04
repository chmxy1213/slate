<!-- 歌单组件 -->
<template>
    <div class="playlist-container">
        <!-- 页面头 -->
        <div class="header">
            <div class="cover">
                <img :src="thisTopList.coverImgUrl">
            </div>
            <div class="section-two">
                <div class="playlist-name">
                    <p>{{ thisTopList.name }}</p>
                </div>
                <div class="playlist-playcount">
                    <p>播放&nbsp;{{ thisTopList.playCount }}&nbsp;次</p>
                </div>
            </div>
        </div>
        <!-- 页面体 -->
        <div class="body">
            <div class="btns">
                <div class="btn-play">
                    <i class="fa fa fa-play"></i>
                </div>
            </div>
            <div class="line"></div>
            <Table :header="header" :data="songs" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { invoke } from "@tauri-apps/api";
import Table from "../components/table/Table.vue";
import { useRoute } from "vue-router";
import { useTopListStore } from "../stores/topList";

const { topLists } = useTopListStore();
const route = useRoute();

const thisTopList = ref({});
const header = ["#", "标题", "专辑", "时长"];
const data = ref([]);   // This request native data, not process.
const songs = ref([]);  // this is songs data, after process.

// Request top list music use route's query's id
async function get(limit, offset) {
    let res = await invoke("get_hot_music_list", { id: route.query.id * 1, limit, offset });
    if (res.code === 200) {
        data.value.push(...res.songs);
    }
}

// TODO: this fucntion is some same with `req.js`.
// process the request's data
// Require: id, name, picUrl, artists, album, time
function processData() {
    data.value.forEach((value) => {
        // Process artists
        let ars = "";  // Artist String
        value.ar.forEach((value) => {
            ars += `${value.name}`;
        });
        ars = ars.replace(/^(\s|,)+|(\s|,)+$/g, '');
        // Process duration
        let dt_s = Math.floor(value.dt / 1000);
        let time_min = Math.floor(dt_s / 60);
        let time_s = Math.floor(dt_s - (time_min * 60));
        let time_string = time_min + ':' + time_s;
        // push to songs state
        songs.value.push({
            id: value.id,
            name: value.name,
            picUrl: value.al.picUrl,
            artists: ars,
            album: value.al.name,
            time: time_string,
        });
    });
}

onBeforeMount(async () => {
    // LOG
    console.log("Playlist.vue's log.");
    // find this top list data from `topLists Store`.
    topLists.data.forEach((value) => {
        if (value.id == route.query.id) {
            thisTopList.value = value;
        }
    });
    // Request data
    await get(10, 0);
    // Process data
    processData();
});
</script>

<style scoped lang="less">
.playlist-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-top: 60px;

    .header {
        display: flex;
        flex-direction: row;
        background-color: #457394;

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

            .playlist-name {
                p {
                    font-size: 35px;
                    font-weight: 900;
                }

                margin-bottom: 10px;
            }
        }

    }


    .body {
        display: flex;
        flex-direction: column;
        background: linear-gradient(#213646, #121212);
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

                i {
                    color: #000;
                    font-size: 20px;
                }
            }
        }

        .line {
            width: 100%;
            height: 1px;
            background-color: #30383d;
        }

        .table-header {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: 1fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            padding: 5px;
        }
    }
}
</style>