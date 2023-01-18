import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'index',
			component: () => import('../view/Home.vue')
		},
		{
			path: '/home',
			name: 'home',
			component: () => import('../view/Home.vue'),
		},
		{
			path: '/search',
			name: 'search',
			component: () => import('../view/Search.vue'),
		},
		{
			path: '/like',
			name: 'like',
			component: () => import('../view/Like.vue'),
		},
	]
});

export default router;
