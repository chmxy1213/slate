<template>
	<div class="container">
		<div class="menus">
			<Menus />
		</div>
		<div class="body">
			<nav class="nav">
				<a href="#">后退</a>
				<a href="#">前进</a>
				<a href="#">用户名</a>
			</nav>
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

import "../assets/css/base.css";
import Menus from "../components/Menus.vue";
import Player from "../components/Player.vue";
import { useMusicStore } from "../stores/music";
import { usePlayListStore } from "../stores/playList";

const { music, load, play, pause } = useMusicStore();
const { playlistState, previous, next, add, remove } = usePlayListStore();

let ids = [28731108, 34274470, 65533, 65528, 1974443814, 65536, 28563317, 65538];

onBeforeMount(async () => {
	// check service
	let state = await invoke("check_server");
	console.log(state);
	if (state.code != 200) {
		console.log("Service is not ok!");
	}

	ids.forEach(async (id) => {
		await add(id);
	});

	// setTimeout(async () => {
	// 	await load(playlistState.list[playlistState.idx]);
	// }, 1000);

	await listen("event-previous", (event) => {
		console.log("上一首");
		console.log(event.event);
		console.log(event.payload);
		previous();
	});

	await listen("event-next", (event) => {
		console.log("下一首");
		console.log(event.event);
		console.log(event.payload);
		next();
	});
});
</script>

<style scoped lang="less">
.container {
	display: grid;
	grid-template-columns: repeat(9, 1fr);
	grid-template-rows: repeat(19, 1fr);
	background-color: #00000000;
	width: 100%;
	height: 100%;
	overflow: hidden;

	.menus {
		grid-column-start: 1;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: 18;
		// background-color: #000000;
		background-color: #22212c;
		border-right: 1px solid #282828;
	}

	.body {
		grid-column-start: 2;
		grid-column-end: 10;
		grid-row-start: 1;
		grid-row-end: 18;
		// background-color: #121212;
		background-color: #151320;
		overflow: auto;
		display: flex;
		flex-direction: column;

		.nav {
			display: flex;
			flex-grow: 0;
			// height: 100px;
			margin-top: 10px;

			a {
				margin-left: 20px;
			}
		}

		.body {
			display: flex;
			flex-grow: 1;
		}
	}

	.player {
		grid-column-start: 1;
		grid-column-end: 10;
		grid-row-start: 18;
		grid-row-end: 20;
		background-color: #181818;
		border-top: 1px solid #282828;
		// display: flex;
		// flex-direction: column;
		// justify-content: center;
		// align-items: center;
	}
}
</style>
