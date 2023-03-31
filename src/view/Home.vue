<template>
    <div class="home-msg">
        <div class="test">
            <Card class="test-2">
                <p>每日推荐</p>
            </Card>
            <Card class="test-2">
                <p>飙升榜</p>
            </Card>
            <Card class="test-2">
                <p>新歌榜</p>
            </Card>
            <Card class="test-2">
                <p>原创榜</p>
            </Card>
            <Card class="test-2">
                <p>热歌榜</p>
            </Card>
            <Card class="test-2">
                <p>新歌速递</p>
            </Card>
            <Card class="test-2">
                <p>推荐歌单</p>
            </Card>
        </div>

    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { invoke } from "@tauri-apps/api";
import Card from '../components/Card.vue';
console.log('主页 log'); // TEST

const hotMusic = [
    { id: 19723756, name: "飙升榜" },
    { id: 3779629, name: "新歌榜" },
    { id: 2884035, name: "原创榜" },
    { id: 3778678, name: "热歌榜" },
    { id: 3778678, name: "新歌速递" },
    { id: 3778678, name: "推荐歌单" },
];
const carList = ref([
    { id: 0, name: "", description: "", coverImgUrl: "" },
]);

onBeforeMount(async () => {
    let res1 = await invoke("get_playlist_detail", { id: 19723756 });
    let res2 = await invoke("get_hot_music_list", { id: 19723756, limit: 10, offset: 0 });
    console.log(res1);
    console.log(res2);
});
</script>

<style scoped lang="less">
.home-msg {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    // flex-wrap: wrap;
    width: 100%;
    height: 100%;
    
    .test {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        
        .test-2 {
            display: flex;
            flex-grow: 0;
            width: 150px;
            height: 150px;
            margin: 10px;
        }
    }
}
</style>