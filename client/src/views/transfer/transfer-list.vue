<template >
    <div>
        <v-data-table
                :headers="headers"
                :items="transfer"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                class="elevation-1"
                @page-count="pageCount = $event"
        >
            <template v-slot:item.name="{ item }">
                {{ (getEquipment(item.equipment_id)).name }}
            </template>
            <template v-slot:item.department_from="{ item }">
                {{ (getDepartment(item.from_dep_id)).name }}
            </template>
            <template v-slot:item.department_to="{ item }">
                {{ (getDepartment(item.to_dep_id)).name }}
            </template>

            <template v-slot:item.date_start="{ item }">
                {{ item.date_start.slice(0,10) }}
            </template>

            <template v-slot:item.warranty="{ item }">
                {{ item.isWarranty ? 'да': 'Нет'}}
            </template>
            <template v-slot:item.action="{ item }">
                <v-icon
                        small
                        class="mx-5"
                        @click="editItem(item)"
                >
                    more_horiz
                </v-icon>
                <v-icon
                        small
                        class="mr-5"
                        @click="editItem(item)"
                >
                    edit
                </v-icon>
            </template>
        </v-data-table>

    </div>
</template >

<script >
    const axios = require('axios');
    import HTTTP from '../../http';
    export default {
        name: "transfer-list",
        data () {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                headers: [
                    {
                        text: 'Оборудование',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Откуда', value: 'department_from' },
                    { text: 'Куда', value: 'department_to' },
                    { text: 'Когда', value: 'date_start' },
                    { text: 'Комментарий', value: 'description' },
                    { text: 'действия', value: 'action' },

                ],
                transfer: [],
                equipment:[],
                department:[]
            }
        },
        mounted(){
            HTTTP().get('/transfer' )
                .then((response)=> {
                    this.transfer.splice(0, this.transfer.length, ...response.data.transfer);
                    this.equipment.splice(0, this.equipment.length, ...response.data.equipment);
                    this.department.splice(0, this.department.length, ...response.data.department);

                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        methods:{
            getEquipment(equipment_id) {
                let our_equipment = this.equipment.filter((item) => {
                    return item.id == equipment_id
                })
                return our_equipment[0]
            },
            getDepartment(department_id) {
                let our_department = []

                our_department = this.department.filter((item) => {
                    return item.id == department_id
                })
                return our_department[0]
            },
            editItem (item) {
                this.$router.push('/transfer/edit/'+item.id)
            },
            showItem (item) {
                this.$router.push('/transfer/'+item.id)
            },
        }
    }
</script >

<style scoped >

</style >