// 数据请求类的工具
import { invoke } from "@tauri-apps/api";


async function reqMusicSource(id) {
    console.log(`music id: ${id}`);
    // Check whether the `id` is valid.
    if (id === 0) {
        return;
    }
    // Music source object
    let mso = {
        name: "",
        artists: "",
        picUrl: "",
        dt: "",
        url: "",
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
    
    // Processing an artist list convents it to an artist string.
    let _as = "";  // Artist String
    mds.songs[0].ar.forEach((value) => {
        _as += `${value.name}`;
    });
    // Regular expressions: remove commas at end of the string.
    _as = _as.replace(/^(\s|,)+|(\s|,)+$/g, '');
    mso.artists = _as;

    // Request the music source url.
    // Response of music source url
    let rmsu = await invoke("get_music_url", { id });
    // Check whether the code equals 200.
    if (rmsu.code !== 200) {
        console.log(`Request themusic source url error of id is ${id}`);
        return;
    }
    mso.url = rmsu.data[0].url;

    return mso;
}


export { reqMusicSource };