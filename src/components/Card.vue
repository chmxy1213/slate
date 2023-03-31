<template>
    <div class="card" @mouseover="visual = true" @mouseout="visual = false">
        <div class="info">
            <div class="cover">
                <img :src="coverImgUrl">
            </div>
            <div class="name">
                <p>{{ name }}</p>
            </div>
            <div class="description">
                <p>{{ description }}</p>
            </div>
        </div>
        <div title="播放" class="play-btn" :class="{ 'play-btn-visible': visual }"
            :style="!visual ? 'display:none;transition: .5s;' : ''">
            <i class="fa fa fa-play"></i>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'

const props = defineProps({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImgUrl: { type: String, required: true },
});

const visual = ref(false);

onBeforeMount(() => {
    console.log('Card log');
    console.log(props);
});
</script>
s
<style scoped lang="less">
.card {
    position: relative;
    background-color: #292e2c;
    border-radius: 10px;
    transition: .5s;
    padding: 20px;
    height: 100px;
    max-width: 30%;
    display: flex;
    flex-grow: 0;

    .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .cover {
            img {
                max-width: 100;
                max-height: 100px;
                overflow: hidden;
            }
        }
        .name {
            color: #f2f2f2;
            font-size: 16px;
            font-weight: 800;
            width: 100%;
        }
        .description {
            color: #7f7f7f;
            font-size: 12px;
            font-weight: 400;
            width: 100%;
        }
    }
}

.card:hover {
    background-color: #434242;
    transition: .5s;
}

.play-btn-visible {
    position: absolute;
    bottom: 10%;
    right: 5%;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #1bc357;
    overflow: hidden;
}

.play-btn-visible:hover {
    transition: .5s ease;
    filter: drop-shadow(0 0 3px #1bc357);
}

.play-btn {
    display: flex;
    justify-content: center;
    align-items: center;

    i {
        color: #000;
    }
}
</style>