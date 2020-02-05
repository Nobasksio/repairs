<template >
    <div
            class="fill-height"
            fluid
    >
        <v-form v-model="valid" >
            <h1 class="display-1" >Инвентаризация </h1 >
            <div class="subtitle-1" >Антрекот КМ (21.10.2020)</div >
            <v-container class="fill-height" fluid >
                <v-list  class="w-100">
                    <v-list-group v-for="(item_category,category) in groupSet" >
                        <template v-slot:activator >
                            <v-list-item-title >{{category}}</v-list-item-title >
                        </template >

                            <v-list-group
                                    no-action
                                    sub-group
                                    v-if="name_arr.groups.length>1"
                                    v-for="name_arr in item_category"
                            >
                                <template v-slot:activator >
                                    <v-list-item-content >
                                        <v-list-item-title >{{name_arr.name}} {{name_arr.groups.length}} шт
                                        </v-list-item-title >
                                    </v-list-item-content >

                                </template >


                                <v-list-item
                                        v-if="name_arr.groups.length>1"
                                >
                                    <template >
                                        <v-list-item-content >
                                            <v-list-item-title
                                            > все
                                            </v-list-item-title >
                                        </v-list-item-content >
                                        <v-list-item-action @click="toogle_group(name_arr)" >
                                            <v-checkbox
                                                    v-model="name_arr.status"
                                                    color="primary"
                                            ></v-checkbox >
                                        </v-list-item-action >
                                    </template >
                                </v-list-item >
                                <v-list-item
                                        v-for="item in name_arr.groups"
                                >
                                    <template >
                                        <v-list-item-content >
                                            <v-list-item-title
                                            > {{ `${item.name} / ${item.in_number_uniq}` }}
                                            </v-list-item-title >
                                        </v-list-item-content >
                                        <v-list-item-action >
                                            <v-checkbox
                                                    v-model="item.inventory_row.status"
                                                    color="primary"

                                            ></v-checkbox >
                                        </v-list-item-action >
                                    </template >
                                </v-list-item >
                            </v-list-group >
                        <template v-else>
                            <v-list-item v-for="item in name_arr.groups">
                                <template >
                                    <v-list-item-content >
                                        <v-list-item-title
                                        > {{ `${item.name} / ${item.in_number_uniq}` }}
                                        </v-list-item-title >
                                    </v-list-item-content >
                                    <v-list-item-action >
                                        <v-checkbox
                                                v-model="item.inventory_row.status"
                                                color="primary"

                                        ></v-checkbox >
                                    </v-list-item-action >
                                </template >
                            </v-list-item>
                        </template>


                    </v-list-group >
                </v-list >

            </v-container >
        </v-form >
    </div >
</template >

<script >
    export default {
        name: "inventory",
        mounted() {
            this.HTTP().get('/inventory/' + this.$route.params.id)
                .then((response) => {
                    this.inventory = response.data.inventory;
                    this.equipments.splice(0, this.equipments.length, ...response.data.inventoryEquipment);


                })
                .catch((error) => {
                    console.log(error);
                })
        },
        data() {
            return {
                inventory: {},
                equipments: [],
                myau: false,
                valid: false,
            }
        },
        methods: {
            toogle_group(item_group) {


                item_group.groups.forEach((item) => {
                    item.inventory_row.status = item_group.status
                })
            },
            get_name(equipment_id) {
                let equipment = this.equipments.filter((item) => {
                    return item.id == equipment_id
                })

                return equipment[0].name
            },
            get_status(equipment) {
                let equipment_output = this.inventory.InventoryItems.filter((item) => {
                    return item.equipment_id == equipment.id
                })

                return equipment_output[0]
            },
            groupName(equipments) {
                let group = {}, sort_group_alp = [], sort_len = []
                equipments.forEach((item) => {
                    if (group[item.name] !== undefined) {
                        item.inventory_row = this.get_status(item)
                        group[item.name]['groups'].push(item)
                    } else {
                        group[item.name] = {
                            groups: [],
                            status: false,
                            name:item.name
                        }
                        item.inventory_row = this.get_status(item)
                        group[item.name]['groups'].push(item)
                    }

                })

                for (let index in group){
                    if (group[index].groups.length == 1){
                        sort_len.unshift(group[index])
                    } else{
                        sort_len.push(group[index])
                    }

                }



                return sort_len
            }
        },
        computed: {
            groupSet() {
                let groups = {}
                this.equipments.forEach((item) => {
                    if (groups[item.type_eq_id] !== undefined) {
                        groups[item.type_eq_id].push(item)
                    } else {
                        groups[item.type_eq_id] = []
                        groups[item.type_eq_id].push(item)
                    }

                })
                for (let index in groups) {

                    groups[index] = this.groupName(groups[index])
                }



                return groups
            }
        }
    }
</script >

<style scoped >
    .w-100{
        width: 100%;
    }
</style >