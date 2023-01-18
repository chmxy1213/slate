<template>
    <div class="home-msg">
        <Card>
            <p>Card1</p>
        </Card>
        <Card>
            <p>Card2</p>
        </Card>
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
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>