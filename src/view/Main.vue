<template>
	<div class="container">
		<div class="menus">
			<Menus />
		</div>
		<div class="body" @scroll="scrollEvent">
			<Nav />
			<RouterView class="box" />
		</div>
		<div class="player">
			<Player />
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, onMounted } from "vue";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import Nav from "../components/Nav.vue";
import "../assets/css/base.css";
import Menus from "../components/Menus.vue";
import Player from "../components/Player.vue";
import { useMusicStore } from "../stores/music";
import { usePlayQueueStore } from "../stores/playQueue";
import { debounceAsync } from "../tools/debounce";
import { useSysStore } from "../stores/sys"
import { useUserStore } from "../stores/user";

const { music, load, play, pause, initAudio } = useMusicStore();
const { playQueueState, previous, next, add, remove } = usePlayQueueStore();
const { scrollToBottom, change } = useSysStore();
const { user, playlists } = useUserStore();

let ids = [28731108, 34274470, 65533, 65528, 1974443814, 65536, 28563317, 65538];

// scroll event
const scrollHandler = debounceAsync(async function (event) {
	// Check if the scroll is at the bottom
	if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
		change(true);
		setTimeout(() => {
			change(false);
		}, 500);
	}
}, 500);
async function scrollEvent(event) {
	await scrollHandler(event);
}

onBeforeMount(async () => {
	// check service
	let state = await invoke("check_server");
	console.log(state);
	if (state.code != 200) {
		console.log("Service is not ok!");
	}

	// init audio
	initAudio();

	ids.forEach(async (id) => {
		await add(id, -1);
	});

	await listen("event-previous", async (event) => {
		console.log("上一首");
		console.log(event.event);
		console.log(event.payload);
		await previous();
	});

	await listen("event-next", async (event) => {
		console.log("下一首");
		console.log(event.event);
		console.log(event.payload);
		await next();
	});

	// 请求用户歌单头部信息
	let [data, err] = await invoke("get_all_playlist_header", {
		token: user.token,
		id: user.id,
	}).then(data => [data, null]).catch(err => [null, err]);
	if (data) {
		data.data.forEach((value) => {
			if (value.name === "__LIKE__") {
				playlists.like.head = value;
			} else {
				playlists.custom.push({ head: value, songs: [] });
			}
		});
		console.log(data);
	} else {
		console.log("获取用户歌单失败");
		console.log(err);
	}
	// 请求歌单中的所有音乐id
	// step1: 请求喜欢歌单
	let [data2, err2] = await invoke("get_allsong_playlist", {
		token: user.token,
		id: playlists.like.head.id,
	}).then(data => [data, null]).catch(err => [null, err]);
	if (data2) {
		data2.data.songIds.forEach((value) => {
			playlists.like.songs.push(value);
		});
		console.log(data2);
	} else {
		console.log("获取用户歌单失败");
		console.log(err2);
	}
	// step2: 请求自定义歌单
	for (let i = 0; i < playlists.custom.length; i++) {
		let [data3, err3] = await invoke("get_allsong_playlist", {
			token: user.token,
			id: playlists.custom[i].head.id,
		}).then(data => [data, null]).catch(err => [null, err]);
		if (data3) {
			data3.data.songIds.forEach((value) => {
				playlists.custom[i].songs.push(value);
			});
			console.log(data3);
		} else {
			console.log("获取用户歌单失败");
			console.log(err3);
		}
	}
});
</script>

<style scoped lang="less">
.container {
	display: grid;
	grid-template-columns: repeat(19, 1fr);
	grid-template-rows: repeat(39, 1fr);
	background-color: #00000000;
	width: 100%;
	height: 100%;
	overflow: hidden;

	.menus {
		grid-column-start: 1;
		grid-column-end: 4;
		grid-row-start: 1;
		grid-row-end: 35;
		background-color: #121212;
		border-right: 1px solid #282828;
	}

	.body {
		grid-column-start: 4;
		grid-column-end: 20;
		grid-row-start: 1;
		grid-row-end: 35;
		// background-color: #000000;
		overflow: auto;
		display: flex;
		flex-direction: column;

		.box {
			display: flex;
			flex-grow: 1;
		}
	}

	.player {
		grid-column-start: 1;
		grid-column-end: 20;
		grid-row-start: 35;
		grid-row-end: 40;
		background-color: #181818;
		border-top: 1px solid #282828;
		// display: flex;
		// flex-direction: column;
		// justify-content: center;
		// align-items: center;
	}
}
</style>
