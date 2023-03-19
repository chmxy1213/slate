import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
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

    async function initMusicSource() {
        let id = music.value.info.id;
        console.log(id);
        if (id != 0) {
            let info = await invoke("get_music_detail", {id});
            if (info.code === 200) {
                music.value.info.name = info.songs[0].name;
                music.value.info.dt = info.songs[0].dt;
                music.value.info.picUrl = info.songs[0].al.picUrl;
                
                let artists_str = "";
                info.songs[0].ar.forEach((v) => {
                    artists_str += `${v.name},`;
                });
                artists_str = artists_str.replace(/^(\s|,)+|(\s|,)+$/g, '');
                music.value.info.artists = artists_str;

                let musicUrlJson = await invoke("get_music_url", { id });
                if (musicUrlJson.code === 200) {
                    music.value.info.url = musicUrlJson.data[0].url;
                } else {
                    console.log(`请求music url 失败! id: ${_currMusicInfo.id}`);
                }
            } else {
                console.log(`请求音乐详情失败：${id}`);
            }
        } else {
            console.log("Not set music id before initialez music source.");
        }
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

    return { music, load, play, pause }
});