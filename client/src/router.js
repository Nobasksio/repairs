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
          component: () => import(/* webpackChunkName: "about" */ './components/cabinet.vue'),
          meta: {title: 'Учет ТМЦ'},
          children: [
              {path: '/', component: () => import('./views/equipment/equipment-list.vue'),
                  meta: {title: 'Учет ТМЦ'},},

              {path: '/equipment/create',
                  component: () => import('./views/equipment/equipment-create.vue'),
                  meta: {title: 'Создание оборудования'}
              },
              {path: '/equipment/:id', component: () => import('./views/equipment/equipment.vue'),},
              {path: '/equipment/edit/:id', component: () => import('./views/equipment/equipment-edit.vue'),},

              {path: '/department/create', component: () => import('./views/department/department-create'),},
              {path: '/departments', component: () => import('./views/department/departments'),},
              {path: '/department/edit/:id', component: () => import('./views/department/department-create'),props: { load: true}},

              {path: '/repair/create', component: () => import('./views/repairs/repair-create'),},
              {path: '/repair', component: () => import('./views/repairs/repair-list.vue'),},
              {path: '/repair/edit/:id', component: () => import('./views/repairs/repair-edit'),},

              {path: '/transfer/create', component: () => import('./views/transfer/transfer-create.vue'),},
              {path: '/transfer/', component: () => import('./views/transfer/transfer-list.vue'),},
              {path: '/transfer/edit/:id', component: () => import('./views/transfer/transfer-edit'),},

              {path: '/settings', component: () => import('./views/settings.vue'),},


              {path: '/group/create', component: () => import('./views/type-create'),},
              {path: '/group/edit/:id', component: () => import('./views/type-create'),props: { load: true}},


              {path: '/provider/create/', component: () => import('./views/provider/provider-create'),},
              {path: '/provider/edit/:id', component: () => import('./views/provider/provider-create'),props: { load: true}},

              {path: '/register', component: () => import('./views/register-form.vue'),},
              {path: '/inventory', component: () => import('./views/inventory/inventories.vue'),},
              {path: '/inventory/:id', component: () => import('./views/inventory/inventory.vue'),},
              {path: '/inventory/create', component: () => import('./views/inventory/inventory-create.vue'),},

          ]
      },
      {path: '/barcodes/', name:"barcode", component: () => import('./views/barcode-print.vue'),props:true},
      {
          path: '/login',
          name: 'login',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './components/kazan-login.vue'),
      },
      {
          path: '/test',
          name: 'test',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './components/test'),
      },
  ],
});
