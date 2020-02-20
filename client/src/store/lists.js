import router from '../router'
import HTTTP from '../http';


export default {
    namespaced:true,
    state:{
        providers:[],
        lastAddedProvider:null,
        departments:[],
        type_eq:[],
        choosedEquimpment:[]
    },
    actions:{
        fill_lists({commit}){
            commit('setAllNull');
            return HTTTP().get('/lists')
                .then(({data})=>{

                commit('addProviders', data.providers);
                commit('addDepartment', data.department);
                commit('addTypes', data.type);
                commit('resetLastAddedProvider')

            }).catch(function (error) {

            })
        },
    },
    mutations:{
        addProviders(state,provider){
            state.providers.push(...provider)
            state.lastAddedProvider = provider[provider.length - 1]
        },
        addDepartment(state,department){
            state.departments.push(...department)
        },
        addTypes(state,type){
            state.type_eq.push(...type)
        },
        setAllNull(state){
            state.providers = []
            state.departments = []
            state.type_eq = []
        },
        resetLastAddedProvider(state){
            state.lastAddedProvider = null
        },
        setChoosedEquipment(state, Equipments){
            state.choosedEquimpment = Equipments;
        }
    }
}