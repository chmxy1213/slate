<template>
    <nav class="nav">
        <div @click="() => router.back()" title="返回">
            <i class="fa fa-angle-left"></i>
        </div>
        <div @click="() => router.forward()" title="前进">
            <i class="fa fa-angle-right"></i>
        </div>
        <a href="javascript:;">{{ user.nickname }}</a>
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
    position: absolute;
    width: 100vh;
    top: 0;
    z-index: 1;
    display: flex;
    flex-grow: 0;
    margin-top: 10px;
    align-items: center;
    
    div {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: #050505;
        cursor: pointer;

        i {
            font-size: 30px;
            font-weight: 1000;
            color: #fff;
        }
    }

    a {
        margin-left: 10px;
        color: #fff;
        font-size: 20px;
        font-weight: 600;
    }
}
</style>