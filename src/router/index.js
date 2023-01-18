import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/home',
			name: 'home',
			component: () => import('../page/Home.vue'),
		},
		{
			path: '/search',
			name: 'search',
			component: () => import('../page/Search.vue'),
		},
		{
			path: '/like',
			name: 'like',
			component: () => import('../page/Like.vue'),
		},
	]
});

export default router;
