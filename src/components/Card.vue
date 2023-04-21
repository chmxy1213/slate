<template>
    <div class="card" @mouseover="visual = true" @mouseout="visual = false" @click="skip">
        <div class="info">
            <div class="cover">
                <img :src="coverImgUrl">
            </div>
            <div class="name">
                <p>{{ name }}</p>
            </div>
        </div>
        <!-- <div title="播放" class="play-btn" :class="{ 'play-btn-visible': visual }"
            :style="!visual ? 'display:none;transition: .5s;' : ''"> -->
        <div title="播放" class="play-btn" :class="[{ 'play-btn-visible': visual }, { 'play-btn-none': !visual }]">
            <i class="fa fa fa-play"></i>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useTopListStore } from "../stores/topList";

const router = useRouter();
const { topLists } = useTopListStore();

const props = defineProps({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImgUrl: { type: String, required: true },
});

const visual = ref(false);

// skip to playlist
function skip() {
    router.push({ name: "playlist", query: { id: props.id, type: "top" } });
    console.log("skip");
}

onBeforeMount(() => {

});
</script>

<style scoped lang="less">
.card {
    position: relative;
    background-color: #292e2c;
    border-radius: 10px;
    transition: .5s;
    padding: 15px;
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
                width: 120px;
                height: 120px;
                border-radius: 3px;
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

.play-btn {
    position: absolute;
    bottom: 10%;
    right: 5%;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #1bc357;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i {
        color: #000;
    }
}

.play-btn-visible {
    animation: moveup .4s;
}

.play-btn-none {
    opacity: 0;
    transform: translateY(5%);
    transition: .4s ease;
}

.play-btn-visible:hover {
    transition: .5s ease;
    filter: drop-shadow(0 0 3px #1bc357);
}



@keyframes moveup {
    0% {
        // transform: translateY(0px);
        bottom: 5%;
        opacity: 0;
    }

    100% {
        // transform: translateY(-10px);
        bottom: 10%;
        opacity: 1;
    }
}
</style>