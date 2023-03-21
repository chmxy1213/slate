<template>
    <div class="container">
        <div class="id">{{ id }}</div>
        <div class="cover">
            <img :src="info.picUrl">
        </div>
        <div class="info">
            <div class="name">
                <p>{{ info.name }}</p>
            </div>
            <div class="artists">
                <p>{{ info.artists }}</p>
            </div>
        </div>
        <div class="album">
            <p>{{ info.album }}</p>
        </div>
        <div class="time">
            <p>{{ info.time }}</p>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount } from "vue";

defineProps({
    id: Number,
    info: Object,
});

onBeforeMount(() => {
    
});
</script>

<style scoped lang="less">
    .container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        .id {
            display: flex;
            align-items: center;
            margin: 2px;
        }
        .cover {
            display: flex;
            align-items: center;
            margin: 2px;
            img {
                width: 50px;
                height: 50px;
            }
        }
        .info {
            display: flex;
            align-items: center;
            margin: 2px;
            .name {
                display: flex;
                align-items: center;
            }
            .artists {
                display: flex;
                align-items: center;
            }
        }
        .album {
            display: flex;
            align-items: center;
            margin: 2px;
        }
        .time {
            display: flex;
            align-items: center;
            margin: 2px;
        }
    }
</style>