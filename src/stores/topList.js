// 榜单数据
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTopListStore = defineStore("toplist", () => {
    const topLists = ref({
        init: false,
        ids: [19723756, 3779629, 2884035, 3778678], // top list id.
        data: [],  // everyone top list data.
        
    });

    return { topLists };
});