import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
import { ref } from "vue";
import { reqMusicSource } from "../tools/req";

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

    async function initMusicSource() {
        let id = music.value.info.id;
        let mso = await reqMusicSource(id);
        music.value.info.name = mso.name;
        music.value.info.dt = mso.dt;
        music.value.info.picUrl = mso.picUrl;
        music.value.info.artists = mso.artists;
        music.value.info.url = mso.url;
    }

    // 加载
    async function load() {
        if (music.value.audio === null) {
            console.log("init audio");
            initAudio();
        }
        if (music.value.info.url !== "") {
            pause();
        } 
        console.log('init music source');
        await initMusicSource();
        console.log("prepare play music");
        music.value.audio.src = music.value.info.url;
        console.log(music.value.info.url);
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