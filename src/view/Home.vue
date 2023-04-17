<template>
    <div class="home-container">
        <div class="load">
            <Loader :dsp="!topLists.init" />
        </div>
        <div class="cards" :style="!topLists.init ? 'display:none;' : ''">
            <Card class="card" v-for="(item, index) in topLists.data" v-bind="item" :key="index" />
        </div>
        <!-- <button @click="testNootificationEvent">测试通知</button> -->
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { invoke } from "@tauri-apps/api";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";
import Card from '../components/Card.vue';
import { useTopListStore } from "../stores/topList";
import Loader from "../components/Loader.vue";

const { topLists } = useTopListStore();

// TEST
async function testNootificationEvent() {
    console.log("testNootificationEvent");
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        // sendNotification('Tauri is awesome!');
        sendNotification({ title: 'TAURI', body: 'Tauri is awesome!' });
    }
}

// initial data.
async function init() {
    console.log("正在执行 top list 初始化");
    if (!topLists.init) {
        topLists.ids.forEach(async (id) => {
            let res = await invoke("get_playlist_detail", { id: id });
            console.log(res);
            if (res.code === 200) {
                topLists.data.push(res.playlist);
            }
        });
        topLists.init = true;
    } else {
        console.log("已初始化，跳过初始化程序");
    }
};

onBeforeMount(async () => {
    console.log("Home.vue's log!");
    await init();
});
</script>

<style scoped lang="less">
.home-container {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .load {
        position: absolute;
        margin: auto;
    }

    .cards {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .card {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 0;
            margin: 10px;
        }
    }
}
</style>