// 榜单数据
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTopListStore = defineStore("toplist", () => {
    const topLists = ref({
        /**
         * @type {boolean}
         */
        init: false,

        /**
         * @type {Array<number>}
         */
        ids: [19723756, 3779629, 2884035, 3778678], // top list id.

        /**
         * @type {Array<{
         *      id: number,
         *      name: string,
         *      coverImgUrl: string,
         *      playCount: number,
         *      trackCount: number,
         *      tracks: Array<{
         *          id: number,
         *          name: string,
         *          ar: Array<{
         *              id: number,
         *              name: string,
         *          }>,
         *          al: {
         *              id: number,
         *              name: string,
         *              picUrl: string,
         *          },
         *      }>,
         * }>}
         */
        data: [],  // everyone top list data.

    });

    return { topLists };
});