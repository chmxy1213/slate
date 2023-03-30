import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const user = ref({
        id: 0,
        name: "",
        email: "",
        token: "",
    });
    
    return { user };
});