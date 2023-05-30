// 和用户相关的工具函数
import { invoke } from "@tauri-apps/api";
import { useUserStore } from "../stores/user";

const { user, playlists } = useUserStore();

/**
 * @description: 用户喜欢音乐
 * @param {number} id 音乐id
 */
export async function likeMusicOrNot(id, flag) {
    console.log("like music: " + id);
    console.log(user.token);
    console.log(playlists.like);
    let tp = "";
    if (flag) {
        tp = "del";
    } else {
        tp = "add";
    }
    let [res, err] = await invoke("update_song_to_playlist", {
        token: user.token,
        pid: playlists.like.head.id,
        sid: id,
        tp,
    }).then((r) => [r, null]).catch((e) => [null, e]);
    if (res) {
        console.log("like music success");
        console.log(res);
        // add id to like playlist
        if (flag) {
            playlists.like.songs.pop(id);
        } else {
            playlists.like.songs.push(id);
        }
    } else {
        console.log("like music failed");
        console.log(err);
    }
}

/**
 * @description 判断用户是否喜欢了该音乐
 * @param {number} id 音乐id
 * @returns {boolean} 是否喜欢
 */
export function checkLikeMusic(id) {
    return playlists.like.songs.includes(id);
}