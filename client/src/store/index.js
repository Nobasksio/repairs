import createPersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import Vuex from 'vuex';


import filter from './filter.js';
import auth from './auth';
import lists from './lists';


Vue.use(Vuex);


export default new Vuex.Store({
    strict:true,
    state: {
      barcode_equipments:[],
        baseUrl:'/api'
    },
    modules:{
        filter,
        auth,
        lists
    },
    mutations: {
    },
    actions: {

        },
    plugins:[
        createPersistedState({
            key: 'filter',
            paths:['filter','auth','lists']
        })
    ]
});

