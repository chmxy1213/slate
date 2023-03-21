import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useMusicStore } from "./music"

export const usePlayListStore = defineStore("playList", () => {
    const { music, load, play, pause } = useMusicStore();
    
    const playlistState = ref({
        list: [],
        idx: 0,
    });

    async function setNewMusic() {
        music.info.id = playlistState.value.list[playlistState.value.idx];
        await load();
        play();
    }

    async function previous() {
        if (playlistState.value.idx <= 0) {
            return;
        }
        playlistState.value.idx--;
        await setNewMusic();
    }

    async function next() {
        if (playlistState.value.idx >= playlistState.value.list.length) {
            return;
        }
        playlistState.value.idx++;
        await setNewMusic();
    }

    return { playlistState, previous, next };
});