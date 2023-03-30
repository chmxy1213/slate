import { invoke } from "@tauri-apps/api";
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user.js";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		// register and login
		// TODO
		{
			path: "/login",
			name: "login",
			component: () => import("../view/Login.vue"),
		},
		// TODO
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
					path: "playlist",
					name: "playList",
					component: () => import("../view/PlayList.vue")
				},
			]
		},
	]
});


// Global router guard.
router.beforeEach(async (to, from) => {
	// ...
	// 返回 false 以取消导航
	// return false
	// if (to.name !== "login") {
	// 	let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODAxNDk1NDUsImlkIjoxLCJuaWNrbmFtZSI6IkRhdmUifQ.QI3Tmf_-5YIyaeP6-6rm_20yWV7etvuASkg591GFUFo	";
	// 	let res = await invoke("check", { token });
	// 	console.log(res);
	// 	if (res.code !== 200) {
	// 		router.push({ name: "login" })
	// 	}
	// }
	
	// TODO
	const { user } = useUserStore();
	console.log(user);
	if (to.name == "main") {
		if (user.token === "") {
			router.push({ name: "login" })
		}
		let res = await invoke("check", { token: user.token });
		console.log(res);
		if (res.code !== 200) {
			router.push({ name: "login" })
		}
		user.id = res.data.id;
		user.nickname = res.data.name;
	}
});

export default router;
