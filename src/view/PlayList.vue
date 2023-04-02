<!-- 歌单组件 -->
<template>
    <div class="playlist-container">
        <!-- 页面头 -->
        <div class="header">
            <div class="cover">
                <img :src="thisTopList.coverImgUrl">
            </div>
            <div class="playlist-name">
                <p>{{ thisTopList.name }}</p>
            </div>
        </div>
        <!-- 页面体 -->
        <div class="body">
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
        let time_string = time_min + ':'+ time_s;
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

    .header {
        display: flex;
        flex-direction: column;

        .cover {
            img {
                width: 100px;
                height: 100px;
            }
        }

        .playlist-name {
            p {
                font-size: 20px;
                font-weight: bold;
            }
        }
    }

    .body {
        display: flex;
        flex-direction: row;

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