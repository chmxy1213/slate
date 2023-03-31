<template>
    <nav class="nav">
        <a href="#">后退</a>
        <a href="#">前进</a>
        <a href="#">{{ user.nickname }}</a>
    </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user';

const { user } = useUserStore();

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