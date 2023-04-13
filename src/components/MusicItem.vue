<template>
    <div class="container-music-item">
        <div class="collect">
            <div class="index">
                <span class="id">{{ id }}</span>
                <span class="index-icon">
                    <i class="fa fa-play fa-play" />
                </span>
            </div>
            <div class="cover">
                <img :src="info.picUrl">
            </div>
            <div class="info">
                <div class="name">
                    <p v-if="info.name.length > 20">{{ info.name.slice(0, 20) + "..." }}</p>
                    <p v-else>{{ info.name }}</p>
                </div>
                <div class="artists">
                    <p v-if="info.artists.length > 20">{{ info.artists.slice(0, 20) + "..." }}</p>
                    <p v-else>{{ info.artists }}</p>
                </div>
            </div>
        </div>
        <div class="album">
            <p>{{ info.album.name }}</p>
        </div>
        <div class="time">
            <p>{{ time.str }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";

const time = ref({
    minute: 0,
    second: 0,
    str: "",
});

const props = defineProps({
    id: Number,
    info: Object,
});

onBeforeMount(() => {
    let dt_s = Math.floor(props.info.dt / 1000.0);

    time.value.minute = Math.floor(dt_s / 60);
    time.value.second = Math.floor(dt_s - time.value.minute * 60);

    let minute_str = "";
    let second_str = "";
    if (time.value.minute < 10) {
        minute_str = '0' + time.value.minute;
    } else {
        minute_str = '' + time.value.minute;
    }
    if (time.value.second < 10) {
        second_str = time.value.second = '0' + time.value.second;
    } else {
        second_str = '' + time.value.second;
    }
    time.value.str = minute_str + ':' + second_str;
});
</script>

<style scoped lang="less">
.container-music-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    padding: 5px;

    .collect {
        grid-area: 1 / 1 / 2 / 3;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        margin-left: 10px;

        .index {
            display: flex;
            align-items: center;
            margin: 2px;
            width: 32px;
            height: 32px;
            .index-icon {
                display: none;
            }
        }

        .cover {
            display: flex;
            align-items: center;
            margin: 2px;
            margin-left: 20px;

            img {
                width: 50px;
                height: 50px;
            }
        }

        .info {
            display: flex;
            align-items: flex-start;
            margin: 2px;
            flex-direction: column;
            margin-left: 20px;

            .name {
                display: flex;

            }

            .artists {
                display: flex;
            }
        }
    }

    .album {
        grid-area: 1 / 3 / 2 / 4;
        display: flex;
        align-items: center;
        margin: 2px;
    }

    .time {
        grid-area: 1 / 4 / 2 / 5;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 2px;
    }
}

.container-music-item:hover {
    border-radius: 5px;
    background-color: #2a2a2a;
    cursor: pointer;
    opacity: 1;
    .collect {
        .index {
            .id {
                display: none !important;
            }
            .index-icon {
                display: inline !important;
            }
        }
    }
}
</style>