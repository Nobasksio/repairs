import HTTTP from '../http';
import router from '../router'

export default {
    namespaced: true,
    state: {
        inventory: null,
        isSync: true,
        dateSync: null,
        equipments: [],
        error: []
    },
    actions: {

        getINventory({commit},inventory_id) {
            return HTTTP().get('/inventory/' + inventory_id)
                .then(({data}) => {


                    commit('setInventory', data.inventory);
                    commit('setEquipments', data.inventoryEquipment);
                    commit('updateDateSync');
                    commit('setIsSync', true);
                }).catch(function (error) {
                    commit('addError', error);
                })
        },
        uploadInventory({commit,state},inventory_id){
            return HTTTP().put('/inventory/' + inventory_id,{
                inventory:state.inventory
            }).then(({data}) => {
                commit('updateDateSync');
                commit('setIsSync', true);
            })
        },

        updateItemStatus({commit,state},inventoryItem){
            let inventory_item_found =  state.inventory.InventoryItems.filter((item)=>{
                return item.equipment_id == inventoryItem.equipment_id
            })

            inventory_item_found[0].status = !inventoryItem.status
            commit('setIsSync', false);

            return HTTTP().put('/inventoryItem/' + inventory_item_found[0].id,{
                intentoryItem:inventory_item_found[0]
            }).then(({data}) => {

                commit('updateDateSync');
                commit('setIsSync', true);


            }).catch(function (error) {
                commit('addError', error);
            })
        }
    },
    mutations: {
        setInventory(state, payload) {
            state.inventory = payload
        },
        updateInventoryNameGroupStatus(state,name_arr){
            if (!state.inventory.isClose) {
                name_arr.groups.forEach((item) => {
                    item.inventory_row.status = name_arr.status
                })
            }
        },
        setEquipments(state, payload) {
            state.equipments.splice(0, state.equipments.length, ...payload)
        },
        addEquipment(state, payload) {
            state.equipments.push(payload)
        },
        addError(state, payload) {
            state.error.push(payload)
        },
        clearError(state, payload) {
            state.error = []
        },
        updateDateSync(state){
            state.dateSync = new Date()
        },
        setIsSync(state,payload){
            state.isSync = payload
        },
        setInventoryClose(state,payload){
            state.inventory.isClose = payload
        },
    },


}