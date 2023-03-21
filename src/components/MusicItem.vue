<template>
    <div class="container">
        <div class="collect">
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 10px;
    opacity: 0.8;

    .collect {
        display: flex;
        align-items: center;
        justify-content: center;
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
            flex-direction: column;

            .name {
                display: flex;
                align-items: center;
            }

            .artists {
                display: flex;
                align-items: center;
            }
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

.container:hover {
    border-radius: 10px;
    background-color: #2a2a2a;
    cursor: pointer;
    opacity: 1;
}
</style>