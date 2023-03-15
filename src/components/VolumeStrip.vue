<template>
    <div class="tools">
        <div class="bar-bg" :style="volumeBarState ? '' : 'display: none'">
            <div class="bar">
                <div class="btn"></div>
            </div>
        </div>
        <div class="volume-icon" title="音量调节" @click="volumeIconClickEnevt">
            <img src="/svg/volume.svg" alt="音量调节">
        </div>
        <div class="list-icon" title="播放列表" @click="toPlayList">
            <img src="/svg/list-icon.svg" alt="播放列表">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const volumeBarState = ref(false);

function volumeIconClickEnevt() {
    volumeBarState.value = !volumeBarState.value;
}

function toPlayList() {
    router.push({ name: "playList" });
}
</script>

<style scoped lang="less">
.tools {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    align-items: center;
    align-content: center;
    // border: 1px antiquewhite solid; // test
    float: left;
    left: -20px;

    .bar-bg {
        transition: 02s ease;
        cursor: pointer;
        // display: none;
        position: absolute;
        top: -100px;
        left: 8px;
        border-radius: 10px;
        width: 6px;
        height: 100px;
        background-color: #05c62c;

        .bar {
            width: 100%;
            height: 50px;
            background-color: #f2f2f2;
            border-radius: 10px 10px 0px 0;

            .btn {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: aqua;
                border-radius: 50%;
                top: 45px;
                left: -2px;
            }
        }
    }

    .volume-icon {
        position: relative;
        display: flex;
        align-items: center;
        margin-right: 10px;
        cursor: pointer;
        border: 1px solid #f2f2f2;

        img {
            height: 25px;
            width: 25px;
        }
    }

    .list-icon {
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
            height: 25px;
            width: 25px;
        }
    }
}</style>