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
        console.log(obj);
        if (music.value.info.url === "") {
            console.log("Error loading music, url: is null");
            // try again
            let i = 0;
            let tryAgiainInterval = setInterval(() => {
                if (music.value.info.url !== "" || i >= 10) {
                    music.value.audio.src = music.value.info.url;
                    clearInterval(tryAgiainInterval);
                }
                i++;
            }, 100);
        } else {
            music.value.audio.src = music.value.info.url;
        }
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

    return { music, load, play, pause, initAudio };
});