<template>
    <nav class="nav">
        <a href="javascript:;" @click="() => router.back()">后退</a>
        <a href="javascript:;" @click="() => router.forward()">前进</a>
        <a href="#">{{ user.nickname }}</a>
    </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const { user } = useUserStore();
const router = useRouter();
</script>

<style scoped lang="less">
.nav {
    // position: absolute;
    display: flex;
    flex-grow: 0;
    // height: 100px;
    margin-top: 10px;

    a {
        margin-left: 20px;
    }
}
</style>