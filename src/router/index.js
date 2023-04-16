import { invoke } from "@tauri-apps/api";
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user.js";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		// register and login
		{
			path: "/login",
			name: "login",
			component: () => import("../view/Login.vue"),
		},
		{
			path: "/",
			name: "main",
			component: () => import("../view/Main.vue"),
			children: [
				{
					path: "home",
					name: "home",
					component: () => import("../view/Home.vue"),
				},
				{
					path: "search",
					name: "search",
					component: () => import("../view/Search.vue"),
				},
				{
					path: "like",
					name: "like",
					component: () => import("../view/Like.vue"),
				},
				{
					// 播放列表
					path: "playqueue",
					name: "playQueue",
					component: () => import("../view/PlayQueue.vue")
				},
				{
					// 榜单列表详情
					path: "playlist",
					name: "playlist",
					component: () => import("../view/Playlist.vue"),
				},
				{
					// 专辑
					path: "album",
					name: "album",
					component: () => import("../view/Album.vue"),
				},
			]
		},
	]
});


// Global router guard.
router.beforeEach(async (to, from) => {
	// 返回 false 以取消导航

	const { user, save, load } = useUserStore();
	
	if (!user.token) {
		load();
	}
	if (to.name === "main" && from.name !== "main") {
		if (user.token === "") {
			router.push({ name: "login" });
			return false;
		}
		let res = await invoke("check", { token: user.token });
		if (res.code !== 200) {
			router.push({ name: "login" })
			return false;
		}
		user.id = res.data.id;
		user.nickname = res.data.name;
		save();
		return true;
	}
});

export default router;
