

export default{
    namespaced: true,
    state:{
        departmentFilter:[4,5],
        groupFilter:null,
        nameFilter:null,
        iunumberFilter:null
    },
    action:{
        register({commit, state }){

        }
    },
    mutations:{
        setDepartmentFilter(state, department){
            state.departmentFilter = department;
        },
        setGroupFilter(state, group){
            state.groupFilter = group;
        },
    }

};