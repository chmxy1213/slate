import { defineStore } from "pinia";
import { ref } from "vue";

export const useMusicStore = defineStore("music", () => {
    const music = ref({
        audio: null,
        info: {
            id: 0,
            name: "",
            artists: "",
            picUrl: "",
            url: "",
        },
        playStatus: false,
    });

    function initAudio() {
        music.value.audio = new Audio();
        music.value.audio.loop = false;
        music.value.audio.preload = "meta";
    }

    // Load music source from play list.
    async function loadSource(obj) {
        let { id, name, artists, picUrl, url } = obj;
        music.value.info = {
            id,
            name,
            artists,
            picUrl,
            url,
        };
    }       

    // Load.
    async function load(obj) {
        if (music.value.audio === null) {
            initAudio();
        }
        if (music.value.info.url !== "") {
            pause();
        }
        await loadSource(obj);
        music.value.audio.src = music.value.info.url;
    }

    // 播放暂替
    function play() {
        music.value.audio.play();
        music.value.playStatus = true;
    }

    function pause() {
        music.value.audio.pause();
        music.value.playStatus = false;
    }

    return { music, load, play, pause };
});