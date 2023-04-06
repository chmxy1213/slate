import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
    const searchRes = ref({
        latest: {
            keyword: null,
            data: null,
        },
    });

    return { searchRes };
});