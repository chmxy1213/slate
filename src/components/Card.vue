<template>
    <a class="card" 
        @mouseover="visual = true"
        @mouseout="visual = false"
    >
        <slot/>
        <div class="play-btn" :class="{ 'play-btn-visible' : visual}" :style="!visual ? 'display:none;transition: .5s;' : ''">
            <a href="#">p</a>
        </div>
    </a>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    status: { type: Number, require: true, default: 0 },  // 0: None, 1: Stop, 2: Playing
});

const visual = ref(false);
</script>

<style scoped lang="less">
    .card {
        position: relative;
        background-color: #292e2c;
        border-radius: 10px;
        transition: .5s;
        padding: 20px;
        margin: 20px;
        width: 200px;
        height: 100px;
    }
    .card:hover {
        background-color: #434242;
        transition: .5s;
    }
    
    .play-btn-visible {
        // z-index: 1;
        display: inline-block;
        position: absolute;
        bottom: 10%;
        right: 5%;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background-color: aquamarine;
    }
    .play-btn {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>