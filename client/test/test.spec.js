
import Vue from "vue";
import { mount, createLocalVue } from '@vue/test-utils';
import moxios from 'moxios';
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import login from '../src/components/kazan-login';
import createComp from '../src/views/equipment/equipment-create';
import auth from '../src/store/auth';


const localVue = createLocalVue()

localVue.use(Vuex)

// import { getters } from '../src/store/auth'

jest.mock('axios',() => {
    return {
        create:() => {
            return {
                get: () => Promise.resolve({data: {
                        department:[],
                        type:[],
                        providers:[]
                    }}),
                post:() => Promise.resolve({data: 'value'}),
             }
        },
    }
})


describe('login.vue', () => {

    let vuetify,
        actions,
        store;
    beforeEach(() => {
        Vue.use(Vuetify);
        Vue.use(Vuex);
        localVue.use(Vuex);
        localVue.use(Vuetify);
        vuetify = new Vuetify;
        store = new Vuex.Store({
             modules:{
                 auth
             }
         })
    })

    it('works', () => {
        let wrapper = mount(createComp,{
            vuetify
        })
        expect(true).toBe(true)
    })

    it('test', () => {
        let wrapper = mount(login,{
            vuetify,
            store
        })
        expect(wrapper.html()).toContain('Вход в систему')
    })


    it('createComp', () => {
        let wrapper = mount(login,{
            sync: false,
            localVue,
            vuetify,
            store,
        })

        let button = wrapper.find(".v-btn")
        button.trigger('click')


        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.error').isVisible()).toBe(true)
            done()
        })





    })


})