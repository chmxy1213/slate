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
			<RouterView class="box"/>
		</div>
		<div class="player">
			<Player/>
		</div>
	</div>
</template>

<script setup>
import "./assets/css/base.css";
import Menus from "./components/Menus.vue";
import Player from "./components/Player.vue";
</script>

<style scoped lang="less">
.container {
	display: grid;
	grid-template-columns: repeat(9, 1fr);
	grid-template-rows: repeat(19, 1fr);
	background-color: #00000000;
	width: 100%;
	height: 100%;
	overflow: auto;

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
