<template>
    <div class="box">
        <div class="item" v-for="item in list">
            <MusicItem :id="item.id" :info="item"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import MusicItem from "../components/MusicItem.vue";

const list = ref([
    { id: 1, picUrl: "cover/我的名字.jpg", name: "a", artists: "artists", album: "album", time: "3:45" },
    { id: 2, picUrl: "cover/我的名字.jpg", name: "b", artists: "artists", album: "album", time: "3:45" },
    { id: 3, picUrl: "cover/我的名字.jpg", name: "c", artists: "artists", album: "album", time: "3:45" },
])
</script>

<style scoped lang="less">
    .box {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 10px;
        flex-grow: 1;
        .item {
            width: 100%;
        }
    }
</style>