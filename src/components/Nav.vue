<template>
    <header class="nav">
        <div class="nav-item" @click="() => router.back()" title="返回">
            <i class="fa fa-angle-left"></i>
        </div>
        <div class="nav-item" @click="() => router.forward()" title="前进">
            <i class="fa fa-angle-right"></i>
        </div>
        <a href="javascript:;">{{ user.nickname }}</a>
        <div class="logout" @click="logout">登出</div>
    </header>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const { user, remove } = useUserStore();
const router = useRouter();

function logout() {
    remove();
    router.push({name: "login"});
    location.reload();
    console.log("登出");
}
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

    .logout {
        font-size: 15px;
        font-weight: 400px;
        margin-left: 20px;
        padding: 2px 5px 2px 5px;
        cursor: pointer;
        border: 1px solid #c1c1c1;
        border-radius: 5px;
        color: #c1c1c1;
    }

    .logout:hover {
        padding: 3px 6px 3px 6px;
        border: 1px solid #f1f1f1;
        color: #f1f1f1;
    }
}
</style>