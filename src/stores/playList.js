import { defineStore } from "pinia";
import { ref } from "vue";

// 该store用于存储请求的歌单歌曲数据
export const usePlayListStore = defineStore("PlayList", () => {
    // { id:1, items: {} }
    const playListData = ref([]);

    return { playListData };
});