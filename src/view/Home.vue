<template>
    <div class="home-msg">
        <div class="test">
            <Card class="test-2" v-for="(item, index) in cardList" v-bind="item" :key="index" />
        </div>
        <button @click="testNootificationEvent">测试通知</button>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { invoke } from "@tauri-apps/api";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";
import Card from '../components/Card.vue';


const hotMusic = [
    { id: 19723756, name: "飙升榜" },
    { id: 3779629, name: "新歌榜" },
    { id: 2884035, name: "原创榜" },
    { id: 3778678, name: "热歌榜" },
    { id: 3778678, name: "新歌速递" },
    { id: 3778678, name: "推荐歌单" },
];

const cardList = ref([
    { id: 0, name: "飙升榜", description: "飙升榜-描述", coverImgUrl: "/cover/我的名字.jpg" },
    { id: 0, name: "新歌榜", description: "新歌榜-描述", coverImgUrl: "/cover/我的名字.jpg" },
    { id: 0, name: "原创榜", description: "原创榜-描述", coverImgUrl: "/cover/我的名字.jpg" },
    { id: 0, name: "热歌榜", description: "热歌榜-描述", coverImgUrl: "/cover/我的名字.jpg" },
    { id: 0, name: "新歌速递", description: "新歌速递-描述", coverImgUrl: "/cover/我的名字.jpg" },
    { id: 0, name: "推荐歌单", description: "推荐歌单-描述", coverImgUrl: "/cover/我的名字.jpg" },
]);

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

onBeforeMount(async () => {
    console.log("Home.vue's log!");
    let res1 = await invoke("get_playlist_detail", { id: 19723756 });
    let res2 = await invoke("get_hot_music_list", { id: 19723756, limit: 10, offset: 0 });
    console.log(res1);
    console.log(res2);
});
</script>

<style scoped lang="less">
.home-msg {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .test {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .test-2 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 0;
            width: 150px;
            height: 150px;
            margin: 10px;
        }
    }
}
</style>