import { defineStore } from "pinia";
import { ref } from "vue";
import { useMusicStore } from "./music"
import { reqMusicDetail, reqMusicSource } from "../tools/req";

export const usePlayListStore = defineStore("playList", () => {
    const { music, load, play, pause } = useMusicStore();

    const playlistState = ref({
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

    // Add a new music id from music detail object in the playlist.
    async function add(id) {
        let res = await loadMusicDetail(id);
        let obj = {
            id,
            ...res
        };
        console.log(obj);
        playlistState.value.list.push(obj);
    }

    // Remove a music id from music detail object in the playlist.
    function remove(id) {
        playlistState.value.list = playlistState.value.list.filter(item => item.id !== id);
    }

    // play previous music.
    async function previous() {
        if (playlistState.value.idx <= 0) {
            return;
        }
        playlistState.value.idx--;
        await load(playlistState.value.list[playlistState.value.idx]);
        play();
    }

    // play next music.
    async function next() {
        if (playlistState.value.idx >= playlistState.value.list.length) {
            return;
        }
        playlistState.value.idx++;
        await load(playlistState.value.list[playlistState.value.idx]);
        play();
    }

    // Play music by index.
    async function playThis(index) {
        playlistState.value.idx = index;
        await load();
        play();
    }

    return { playlistState, add, remove, previous, next, playThis };
});