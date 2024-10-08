import { invoke } from "@tauri-apps/api/core"
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const user = ref({
        id: 0,
        nickname: "",
        email: "",
        token: "",
    });

    const playlists = ref({
        like: {
            head: {},
            songs: [],
        },
        // { head:{}, songs:[] }
        custom: [],
    });

    // save data to local storage
    function save() {
        localStorage.setItem("user", JSON.stringify(user.value));
    }

    function remove() {
        localStorage.removeItem("user");
    }

    // TODO check token
    // async function check() {
    //     let res = await invoke("check", { token: user.value.token });
    // }

    // load data from local storage
    function load() {
        let data = localStorage.getItem("user");
        if (data) {
            let p = JSON.parse(data);
            user.value.id = p.id;
            user.value.nickname = p.nickname;
            user.value.email = p.email;
            user.value.token = p.token;
        }
    }
    return { user, playlists, save, remove, load };
});