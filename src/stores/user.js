import { invoke } from "@tauri-apps/api";
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
        like: {},
        custom: [],
    });

    // save data to local storage
    function save() {
        localStorage.setItem("user", JSON.stringify(user.value));
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
    return { user, playlists, save, load };
});