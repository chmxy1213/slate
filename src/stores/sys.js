// 系统中转变量
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSysStore = defineStore("sys", () => {
    // 滚动条相关
    const scrollToBottom = ref(false);
    function change(state) {
        scrollToBottom.value = state;
    }
    const getScrollState = computed(() => scrollToBottom.value);

    // 右键菜单相关
    const contextMenu = ref({
        show: false,
        x: 0,
        y: 0,
        event: null,
    });
    
    return { scrollToBottom, change, getScrollState, contextMenu };
});