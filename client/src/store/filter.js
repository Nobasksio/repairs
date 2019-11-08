
export default{
    namespaced: true,
    state:{
        departmentFilter:[],
        groupFilter:[],
        nameFilter:null,
        numberUniqFilter:null
    },
    actions:{
        clear({ commit }){
            commit('setDepartmentFilter', [])
            commit('setGroupFilter', [])
            commit('setNameFilter', null)
            commit('setNumberUniqFilter', null)
        }
    },
    getters:{
        departmentFilter:(state)=>{
            state.departmentFilter
        },
        groupFilter:(state)=>{
            state.groupFilter
        },
    },
    mutations:{
        setDepartmentFilter(state, department){
            state.departmentFilter = department;
        },
        setGroupFilter(state, group){
            state.groupFilter = group;
        },
        setNameFilter(state, name){
            state.nameFilter = name;
        },
        setNumberUniqFilter(state, num){
            state.numberUniqFilter = num;
        },
    },


};