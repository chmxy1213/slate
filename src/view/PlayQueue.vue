<!-- 播放队列 -->
<template>
    <div class="box">
        <div class="item" v-for="(item, index) of store.list">
            <MusicItem :id="index + 1" :info="item" @dblclick="dblclick(item)"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import MusicItem from "../components/MusicItem.vue";
import { usePlayListStore } from "../stores/playList";
import { useMusicStore } from "../stores/music";

const { load, play } = useMusicStore();
const { playlistState: store } = usePlayListStore();

// Click item play music event.
async function dblclick(obj) {
    console.log(`double click: ${obj}`);
    await load(obj);
    play();
}
</script>

<style scoped lang="less">
    .box {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 10px;
        flex-grow: 1;
        margin-top: 60px;
        .bg-1 {
            background-color: #000;
        }
        .bg-2 {
            background-color: #000;
        }
        .item {
            width: 100%;
        }
    }
</style>