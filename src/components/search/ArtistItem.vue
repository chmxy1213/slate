<!-- 歌手子项 -->
<template>
    <div class="artist-item">
        <div class="cover">
            <img :src="props.picUrl">
        </div>
        <div class="artist">
            <span>{{ props.name }}</span>
        </div>
        <div class="type">
            <span>歌手</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    id: {
        type: Number,
        default: 0,
        required: true,
    },
    name: {
        type: String,
        default: "",
        required: true,
    },
    picUrl: {
        type: String,
        default: "",
        required: true,
    },
});
</script>

<style scoped lang="less">
.artist-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100px;
    height: 200px;
    margin: 10px;

    .cover {
        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }
    }

    .artist {
        color: #fff;
        font-size: 15px;
        font-weight: bolder;

        span {
            display: inline-block;
        }
    }

    .type {
        color: #999;
        font-size: 12px;
        font-weight: bold;
    }
}

.artist-item:hover {
    cursor: pointer;
    background-color: #fff;
    color: #282828;
}
</style>