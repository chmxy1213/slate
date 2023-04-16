<template>
    <div class="search-container" @scroll="scrollEvent">
        <div class="search-input">
            <label for="search" class="label">
                <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" />
            </label>
            <input id="search" type="text" placeholder="想听什么？" @keyup.enter="searcheEvent" v-model.trim="keyword"
                @focus="inputFocusEvent">
        </div>
        <div class="search-label">
            <span :class="{ 'selected': searchStore.typeIdx == index }" v-for="(item, index) in searchTypes" :key="index"
                @click="labelClickEvent(index)">{{ item.type }}</span>
        </div>
        <div class="search-res">
            <!-- 加载动画 -->
            <Loader :dsp="resState == 0" />
            <div class="res-table" :style="resState == 1 ? '' : 'display:none;'">
                <Box :searchType="searchTypes[searchStore.typeIdx].id" :data="searchStore.data" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { invoke } from "@tauri-apps/api";
import { useSearchStore } from "../stores/search";
import Box from "../components/search/Box.vue";
import Loader from "../components/Loader.vue";
import { debounceAsync } from "../tools/debounce";

const { searchStore, searchTypes } = useSearchStore();

// result have three state: loading, success, null map to 0, 1, 2
const resState = ref(2);

const keyword = ref("");

// TODO: this fucntion is some same with `req.js` and `Playlist.vue`.
// process the request's data
// Require: id, name, picUrl, artists, album, time
function processData(songs) {
    let tmp = [];
    songs.forEach((value) => {
        // Process artists
        let ars = "";  // Artist String
        value.ar.forEach((value) => {
            ars += `, ${value.name}`;
        });
        ars = ars.replace(/^(\s|,)+|(\s|,)+$/g, '');
        // Process duration
        let dt_s = Math.floor(value.dt / 1000);
        let time_min = Math.floor(dt_s / 60);
        let time_s = Math.floor(dt_s - (time_min * 60));
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

// Request data and process data
async function get(limit, offset) {
    let res = await invoke("search", {
        tp: searchTypes[searchStore.typeIdx].id,
        keyword: keyword.value,
        limit: limit,
        offset: offset
    });

    // TODO
    if (searchTypes[searchStore.typeIdx].id == 1) {
        searchStore.data.songs.push(...processData(res.Song.result.songs));
    } else if (searchTypes[searchStore.typeIdx].id == 10) {
        searchStore.data.albums.push(...res.Album.result.albums);
    } else if (searchTypes[searchStore.typeIdx].id == 100) {
        searchStore.data.artists.push(...res.Artist.result.artists);
    } else if (searchTypes[searchStore.typeIdx].id == 1000) {
        searchStore.data.playlists.push(...res.Playlist.result.playlists);
    }
}

// Search event
async function searcheEvent() {
    if (keyword.value == "") {
        console.log("搜索关键字不能为空");
        return;
    }
    if (keyword.value != searchStore.keyword) {
        searchStore.data.songs = [];
        searchStore.data.albums = [];
        searchStore.data.artists = [];
        searchStore.data.playlists = [];
        searchStore.keyword = keyword.value;
    }

    resState.value = 0;
    await get(30, 0);
    resState.value = 1;
}

// scroll event
const scrollHandler = debounceAsync(async function (event) {
    // Check if the scroll is at the bottom
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
        // request more data
        get(30, searchStore.data.songs.length)
    }
}, 1000);
async function scrollEvent(event) {
    await scrollHandler(event);
}

// label click event
async function labelClickEvent(index) {
    searchStore.typeIdx = index;
    if (keyword.value == "") {
        return;
    }
    if (searchStore.keyword != keyword.value) {
        searchStore.keyword = keyword.value;
        searchStore.data.songs = [];
        searchStore.data.albums = [];
        searchStore.data.artists = [];
        searchStore.data.playlists = [];
    }
    switch (index) {
        case 0:
            if (searchStore.data.songs.length == 0) {
                resState.value = 0;
                await get(30, 0);
                resState.value = 1;
            }
            break;
        case 1:
            if (searchStore.data.albums.length == 0) {
                resState.value = 0;
                await get(30, 0);
                resState.value = 1;
            }
            break;
        case 2:
            if (searchStore.data.artists.length == 0) {
                resState.value = 0;
                await get(30, 0);
                resState.value = 1;
            }
            break;
        case 3:
            if (searchStore.data.playlists.length == 0) {
                resState.value = 0;
                await get(30, 0);
                resState.value = 1;
            }
            break;
    }
}

// input 获取焦点时，选中文本
function inputFocusEvent(event) {
    event.target.select();
}

onBeforeMount(() => {
    console.log('搜索 log');
    keyword.value = searchStore.keyword;
    if (keyword.value != "") {
        resState.value = 1;
    }
});
</script>

<style scoped lang="less">
.search-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin-top: 60px;
    overflow-y: scroll;

    .search-input {
        display: flex;
        justify-content: flex-start;
        margin-left: 40px;
        position: relative;

        .label {
            position: absolute;
            margin: auto;
            top: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            margin-left: 10px;

            .icon {
                color: #000;
                width: 25px;
                height: 25px;
            }
        }

        input {
            border: none;
            outline: none;
            background-color: #fff;
            border-radius: 40px;
            height: 40px;
            padding: 5px 5px 5px 40px;
            width: 60%;
            color: #000;
            font-size: 15px;
            font-weight: bold;
        }
    }

    .search-label {
        display: flex;
        justify-content: flex-start;
        margin-left: 40px;
        margin-top: 10px;

        span {
            margin-right: 10px;
            color: #fff;
            cursor: pointer;
            padding: 4px 8px 4px 8px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bolder;
        }

        .selected {
            background-color: #333333;
        }
    }

    .search-res {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        // border: 1px solid #fff;
        width: 100%;
        flex-grow: 1;

        .res-table {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            height: 100%;
        }
    }
}
</style>