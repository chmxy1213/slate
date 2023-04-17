// 系统中转变量
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSysStore = defineStore("sys", () => {
    // state: () => ({ scrollToBottom: false }),
    
    // getters: {
    //     getScrollState: (state) => state.scrollToBottom,
    // },

    // actions: {
    //     change(state) {
    //         this.scrollToBottom = state;
    //     },
    // },
    const scrollToBottom = ref(false);

    function change(state) {
        scrollToBottom.value = state;
    }
    const getScrollState = computed(() => scrollToBottom.value);

    return { scrollToBottom, change, getScrollState };
});