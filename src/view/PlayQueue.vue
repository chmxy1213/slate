<!-- 播放队列 -->
<template>
    <div class="box">
        <h3 class="title">播放队列</h3>
        <div class="items">
            <div class="item" v-for="(item, index) of store.list">
                <MusicItem :id="index + 1" :info="item" @dblclick="dblclick(index)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import MusicItem from "../components/MusicItem.vue";
import { usePlayQueueStore } from "../stores/playQueue";
import { useMusicStore } from "../stores/music";

const { playQueueState: store, playThis } = usePlayQueueStore();

// Click item play music event.
async function dblclick(idx) {
    await playThis(idx);
}
</script>

<style scoped lang="less">
.box {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    flex-grow: 1;
    margin: 60px 10px 10px 10px;
    padding: 10px;
    border-radius: 10px;
    background-color: #121212;

    .title {
        font-size: 20px;
        color: #fff;
        margin-bottom: 10px;
        padding: 5px;
    }

    .items {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        padding: 5px;

        .item {
            width: 100%;
        }
    }
}
</style>