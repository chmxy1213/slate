// 和用户相关的工具函数
import { invoke } from "@tauri-apps/api";
import { useUserStore } from "../stores/user";

const { user, playlists } = useUserStore();

/**
 * @description: 更新自定义歌单中的歌曲：添加或者删除
 * @param {number} pid 自定义歌单id
 * @param {number} sid 歌曲id
 * @param {boolean} flag 添加或删除标志，true为删除
 * @param {boolean} _default 是否为更新默认歌单（喜欢的音乐歌单）
 */
export async function updateCustomPlaylist(pid, sid, flag, _default) {
    console.log(`update custom playlist: ${pid}, music id: ${sid}`);
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
        pid: _default ? playlists.like.head.id : pid,
        sid,
        tp,
    }).then((r) => [r, null]).catch((e) => [null, e]);
    if (res) {
        console.log("like music success");
        console.log(res);
        // update id to like playlist
        if (flag) {
            if (_default) {
                playlists.like.songs.pop(sid);
            } else {
                for (let i = 0; i < playlists.custom.length; i++) {
                    if (playlists.custom[i].head.id == pid) {
                        playlists.custom[i].songs.pop(sid);
                    }
                }
            }

        } else {
            if (_default) {
                playlists.like.songs.push(sid);
            } else {
                for (let i = 0; i < playlists.custom.length; i++) {
                    if (playlists.custom[i].head.id == pid) {
                        playlists.custom[i].songs.push(sid);
                    }
                }
            }
        }
    } else {
        console.log("update custome playlist failed");
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