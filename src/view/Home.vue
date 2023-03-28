<template>
    <div class="home-msg">
        <div>
            <Card>
                <p>每日推荐</p>
            </Card>
            <Card>
                <p>飙升榜</p>
            </Card>
            <Card>
                <p>新歌榜</p>
            </Card>
        </div>
        <div>
            <Card>
                <p>原创榜</p>
            </Card>
            <Card>
                <p>热歌榜</p>
            </Card>
            <Card>
                <p>新歌速递</p>
            </Card>
            <Card>
                <p>推荐歌单</p>
            </Card>
        </div>

    </div>
</template>

<script setup>
import Card from '../components/Card.vue';
console.log('主页 log'); // TEST
const testData = {}
</script>

<style scoped lang="less">
.home-msg {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
}
</style>