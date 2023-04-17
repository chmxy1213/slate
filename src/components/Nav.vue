<template>
    <header class="nav">
        <div class="nav-item" @click="() => router.back()" title="返回">
            <i class="fa fa-angle-left"></i>
        </div>
        <div class="nav-item" @click="() => router.forward()" title="前进">
            <i class="fa fa-angle-right"></i>
        </div>
        <a href="javascript:;">{{ user.nickname }}</a>
    </header>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const { user } = useUserStore();
const router = useRouter();
</script>

<style scoped lang="less">
.nav {
    position: sticky;
    width: 100%;
    z-index: 999;
    top: 0;
    padding: 10px 0;
    display: flex;
    flex-grow: 0;
    align-items: center;
    background-color: rgba(14, 14, 14, 0.1);
    // background-size: 4px 4px;
    // background-image: radial-gradient(transparent 1px, #141414 1px);
    backdrop-filter: saturate(50%) blur(6px);
    border-bottom: 1px solid #141414;

    .nav-item {
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
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