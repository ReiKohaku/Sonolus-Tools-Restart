import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Content.vue') },
      { path: '/:name+', component: () => import('pages/Content.vue') }
    ],
  }
];

export default routes;
