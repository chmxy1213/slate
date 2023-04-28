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

const { music, load, play, pause, initAudio } = useMusicStore();
const { playQueueState, previous, next, add, remove } = usePlayQueueStore();
const { scrollToBottom, change } = useSysStore();
// const sysStore = useSysStore();

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
