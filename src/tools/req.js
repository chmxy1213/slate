// 数据请求类的工具
import { invoke } from "@tauri-apps/api/core"

// Request music details.
async function reqMusicDetail(id) {
    // Check whether the `id` is valid.
    if (id === 0) {
        return;
    }
    // Music source object
    let mso = {
        id,
        name: "",
        artists: "",
        picUrl: "",
        dt: "",
        album: {
            id: 0,
            name: "",
        },
    };

    // Music detail response.
    let mds = await invoke("get_music_detail", { id });

    // Check whether the code is success.
    if (mds.code !== 200) {
        console.log(`Request music detail error. id: ${id}`);
        return;
    }
    mso.name = mds.songs[0].name;
    mso.picUrl = mds.songs[0].al.picUrl;
    mso.dt = mds.songs[0].dt;
    mso.album.id = mds.songs[0].al.id;
    mso.album.name = mds.songs[0].al.name;
    
    // Processing an artist list convents it to an artist string.
    let _as = "";  // Artist String
    mds.songs[0].ar.forEach((value) => {
        _as += `${value.name}`;
    });
    // Regular expressions: remove commas at end of the string.
    _as = _as.replace(/^(\s|,)+|(\s|,)+$/g, '');
    mso.artists = _as;

    return mso;
}

// Request the music source url.
async function reqMusicSource(id) {
    // Check whether the `id` is valid.
    if (id === undefined || id === null || id === 0) {
        return;
    }
    let res = await invoke("get_music_url", { id });
    if (res.code !== 200) {
        console.log(`Request themusic source url error of id is ${id}`);
        return;
    }
    return { url: res.data[0].url };
}

/**
 * @description 获取音乐详情
 * @typedef {Object} MusicSourceObject
 * @param {number} id 
 * @returns {Promise<MusicSourceObject>}
 */
function getMDPromise(id) {
    return new Promise((resolve, reject) => {
        invoke("get_music_detail", { id })
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.songs[0]);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * @description 异步请求顺序返回
 * @param {Array<Number>} ids 音乐id数组
 * @param {Function} fn 请求函数
 * @returns {Array<Object>}
 */
async function ARRS(ids, fn) {
    let promises = ids.map((item) => {
        return fn(item);
    });
    return Promise.all(promises);
} 

export { reqMusicDetail, reqMusicSource, getMDPromise, ARRS };