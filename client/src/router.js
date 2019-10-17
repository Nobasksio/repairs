/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          name: 'index',
          component: () => import(/* webpackChunkName: "about" */ './components/cabinet.vue'),
          meta: {title: 'Учет ТМЦ'},
          children: [
              {path: '/', component: () => import('./views/equipment-list.vue'),
                  meta: {title: 'Учет ТМЦ'},},

              {path: '/equipment/create',
                  component: () => import('./views/equipment-create.vue'),
                  meta: {title: 'Создание оборудования'}
              },
              {path: '/equipment/:id', component: () => import('./views/equipment.vue'),},
              {path: '/equipment/edit/:id', component: () => import('./views/equipment-edit.vue'),},

              {path: '/department/create', component: () => import('./views/department-create'),},
              {path: '/departments', component: () => import('./views/departments'),},
              {path: '/department/edit/:id', component: () => import('./views/department-create'),props: { load: true}},

              {path: '/repair/create', component: () => import('./views/repair-create'),},
              {path: '/repair', component: () => import('./views/repair-list.vue'),},
              {path: '/repair/edit/:id', component: () => import('./views/repair-edit'),},

              {path: '/transfer/create', component: () => import('./views/transfer-create.vue'),},
              {path: '/transfer/', component: () => import('./views/transfer-list.vue'),},
              {path: '/transfer/edit/:id', component: () => import('./views/transfer-edit'),},

              {path: '/settings', component: () => import('./views/settings.vue'),},


              {path: '/group/create', component: () => import('./views/type-create'),},
              {path: '/group/edit/:id', component: () => import('./views/type-create'),props: { load: true}},


              {path: '/provider/create/', component: () => import('./views/provider-create'),},
              {path: '/provider/edit/:id', component: () => import('./views/provider-create'),props: { load: true}},

              {path: '/register', component: () => import('./views/register-form.vue'),},


          ]
      },
      {
          path: '/login',
          name: 'login',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './components/kazan-login.vue'),
      },
  ],
});
