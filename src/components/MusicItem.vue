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