import { defineStore } from "pinia";
import { ref } from "vue";
import { useMusicStore } from "./music"
import { reqMusicDetail, reqMusicSource } from "../tools/req";

export const usePlayQueueStore = defineStore("playQueue", () => {
    const { music, load, play, pause } = useMusicStore();

    const playQueueState = ref({
        // list of music id.
        // The list of content items is music detail object.
        list: [],
        // index of current music.
        idx: 0,
    });

    // Load one music detail.
    async function loadMusicDetail(id) {
        let res_d = await reqMusicDetail(id);
        let res_s = await reqMusicSource(id);
        return {
            ...res_d,
            ...res_s,
        };
    }

    // Add a new music id from music detail object in the play queue.
    async function add(id, duration) {
        let res = await loadMusicDetail(id);
        let obj = {
            id,
            ...res
        };
        // 追加
        if (duration == -1) {
            playQueueState.value.list.push(obj);
        } else if (duration == 0) {
            // 从头插入
            playQueueState.value.list.unshift(obj);
        }
    }

    // Remove a music id from music detail object in the play queue.
    function remove(id) {
        playQueueState.value.list = playQueueState.value.list.filter(item => item.id !== id);
    }

    // play previous music.
    async function previous() {
        if (playQueueState.value.idx <= 0) {
            return;
        }
        playQueueState.value.idx--;
        await load(playQueueState.value.list[playQueueState.value.idx]);
        play();
    }

    // play next music.
    async function next() {
        if (playQueueState.value.idx >= playQueueState.value.list.length) {
            return;
        }
        playQueueState.value.idx++;
        await load(playQueueState.value.list[playQueueState.value.idx]);
        play();
    }

    // Play music by index.
    async function playThis(index) {
        playQueueState.value.idx = index;
        await load(playQueueState.value.list[playQueueState.value.idx]);
        play();
    }

    return { playQueueState, add, remove, previous, next, playThis };
});