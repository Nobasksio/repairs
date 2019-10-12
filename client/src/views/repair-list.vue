<template >
    <div>
        <v-row >
            <v-col cols="4" >
                <v-autocomplete
                        label="Подразделение"
                        :items="department"
                        v-model="filter.department"
                        chips
                        small-chips
                        multiple
                        item-text="name"
                        item-value="id"
                        outlined
                ></v-autocomplete >
            </v-col >
            <v-col cols="4" >
                <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }" >
                        <v-text-field
                                label="начало периода"
                                outlined
                                v-model="filter.date_start"
                                placeholder="гггг-мм-дд"
                                v-on="on"
                        >
                        </v-text-field >
                    </template >
                    <v-date-picker v-model="filter.date_start"
                                   no-title
                                   scrollable
                                   @change="menu = false"
                    >
                        <div class="flex-grow-1" ></div >
                    </v-date-picker >
                </v-menu >
            </v-col >
            <v-col cols="4" >
                <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"

                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }" >
                        <v-text-field
                                label="конец периода"
                                outlined
                                v-model="filter.date_finish"
                                placeholder="гггг-мм-дд"
                                v-on="on"
                        >
                        </v-text-field >
                    </template >
                    <v-date-picker v-model="filter.date_finish"
                                   no-title
                                   scrollable
                                   @change="menu2 = false"
                    >
                        <div class="flex-grow-1" ></div >
                    </v-date-picker >
                </v-menu >
            </v-col >
        </v-row >
        <v-data-table
                :headers="headers"
                :items="filter_equipments"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                class="elevation-1 "
                @page-count="pageCount = $event"
        >
            <template v-slot:item.name="{ item }">
               {{ (getEquipment(item.equipment_id)).name }}
            </template>
            <template v-slot:item.department="{ item }">
                {{ (getDepartment(item.department_id)).name }}
            </template>
            <template v-slot:item.provider_id="{ item }" >
                {{ (getProvider(item.provider_id)).name}}
            </template >
            <template v-slot:item.date_start="{ item }" >
                {{ date_format(item.date_start)}}
            </template >
            <template v-slot:item.date_finish="{ item }" >
                {{ date_format(item.date_finish)}}
            </template >
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
    export default {
        name: "repair-list",
        data () {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                menu:false,
                menu2:false,
                filter: {
                    department: [],
                    date_start: null,
                    date_finish: null,
                },
                headers: [
                    {
                        text: 'Оборудование',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Подразделение', value: 'department' },
                    { text: 'Дата начала', value: 'date_start' },
                    { text: 'Поставщик', value: 'provider_id' },
                    { text: 'Сумма', value: 'price' },
                    { text: 'Гарантийный', value: 'warranty' },
                    { text: 'Actions', value: 'action', sortable: false,align: 'center', },
                ],
                providers:[],
                repair: [],
                equipment:[],
                department:[]
            }
        },
        mounted() {

            axios.get('/api/repair/')
                .then((response) => {

                    this.repair = response.data.repair
                    this.equipment = response.data.equipments
                    this.department = response.data.department
                    this.providers = response.data.providers
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        methods: {
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
            getProvider(provider_id){
                let our_provider = []


                our_provider = this.providers.filter((item) => {
                    return item.id == provider_id
                })
                return our_provider[0]
            },
            editItem (item) {
                this.$router.push('/repair/edit/'+item.id)
            },
            showItem (item) {
                this.$router.push('/repair/'+item.id)
            },
            date_format(date){
                let new_date = ''
                if (date != null){
                    new_date = date.substr(0,10)
                } else {
                    new_date = ''
                }
                return new_date
            }
        },
        computed:{
            filter_equipments() {
                let filtred;

                if (this.filter.department.length > 0) {
                    filtred = this.repair.filter((item) => {
                        let step = false;
                        for(let i = 0; i < this.filter.department.length;i++  ){
                            if  (item.department_id == this.filter.department[i]){
                                step = true
                                break;
                            }
                        }
                        return step

                    })
                } else {
                    filtred = this.repair
                }






                return filtred
            }
        }
    }
</script >

<style scoped >

</style >