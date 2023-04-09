import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSearchStore = defineStore("search", () => {
    const searchTypes = [
        { id: 1, type: "单曲" },
        { id: 10, type: "专辑" },
        { id: 100, type: "歌手" },
        { id: 1000, type: "歌单" },
    ];

    const searchStore = ref({
        typeIdx: 0,
        keyword: "",
        data: {
            songs: [],
            albums: [],
            artists: [],
            playlists: [],
        },
    });


    return { searchStore, searchTypes };
});