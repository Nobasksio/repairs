

import Vue from 'vue';
import Vuex from 'vuex';
import Meta from 'vue-meta';

Vue.use(Meta);

Vue.use(Vuex);

import { sync } from 'vuex-router-sync';
import { mdiAccount } from '@mdi/js'
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import indexLayout from './components/index-layout';


Vue.component('index-layout',indexLayout);

Vue.config.productionTip = false;

sync(store, router);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
