<template >
    <div >
        <v-row >
            <v-col cols="4" >
                <v-autocomplete
                        label="Подразделение"
                        :items="departments"
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
                class="elevation-1"
                @page-count="pageCount = $event"
        >
            <template v-slot:item.equipment_id="{ item }" >
                {{ (getEquipment(item.equipment_id)).name }}
            </template >
            <template v-slot:item.department_id="{ item }" >
                {{ (getDepartment(item.department_id)).name }}
            </template >

            <template v-slot:item.type_eq_id="{ item }" >
                {{ (getGroup(item.type_eq_id)).name }}
            </template >
            <template v-slot:item.date_buy="{ item }" >
                {{ date_format(item.date_buy)}}
            </template >
            <template v-slot:item.warranty="{ item }" >
                {{ date_format(item.warranty)}}
            </template >
            <template v-slot:item.isWarranty="{ item }" >
                {{ item.isWarranty ? 'да': 'Нет'}}
            </template >
            <template v-slot:item.action="{ item }" >

                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    edit
                </v-icon >
                <v-icon
                        small
                        @click="deleteItem(item)"
                >
                    delete
                </v-icon >
            </template >
        </v-data-table >

    </div >
</template >

<script >
    import HelloWorld from '../components/index-layout';

    const axios = require('axios');
    export default {
        data() {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                menu: false,
                menu2: false,
                departments: [],
                group_eq: [],
                filter: {
                    department: [],
                    date_start: null,
                    date_finish: null,
                },

                headers: [
                    {
                        text: 'Название',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    {text: 'Подразделение', value: 'department_id'},
                    {text: 'Группа', value: 'type_eq_id'},
                    {text: 'Номер', value: 'out_number'},
                    {text: 'Гарантия', value: 'isWarranty'},
                    {text: 'Окончание гарантии', value: 'warranty'},
                    {text: 'Дата Покупки', value: 'date_buy'},
                    // { text: 'В ремонте', value: 'iron' },
                    {text: 'Actions', value: 'action', sortable: false},
                ],
                equipments: [],
            }
        },
        mounted() {
            axios.get('/api/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.group_eq.splice(0, this.group_eq.length, ...response.data.type);
                })
                .catch((error) => {
                    console.log(error);
                })
            axios.get('/api/equipments')
                .then((response) => {
                    this.equipments.splice(0, this.equipments.length, ...response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        computed: {
            filter_equipments() {
                let filtred;

                if (this.filter.department.length > 0) {
                    filtred = this.equipments.filter((item) => {
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
                    filtred = this.equipments
                }






                return filtred
            }
        },
        methods: {
            getEquipment(equipment_id) {
                let our_equipment = this.equipment.filter((item) => {
                    return item.id == equipment_id
                })
                if (our_equipment.length == 0){
                    our_equipment = [{name:''}]
                }
                return our_equipment[0]
            },
            getGroup(type_id) {
                let our_group = this.group_eq.filter((item) => {
                    return item.id == type_id
                })
                if (our_group.length == 0){
                    our_group = [{name:''}]
                }
                return our_group[0]
            },
            getDepartment(department_id) {
                let our_department = []

                our_department = this.departments.filter((item) => {
                    return item.id == department_id
                })
                if (our_department.length == 0){
                    our_department = [{name:'подразделение удалено'}]
                }
                return our_department[0]
            },
            editItem(item) {
                this.$router.push('/equipment/' + item.id)
            },
            deleteItem(item) {
                const index = this.equipments.indexOf(item)
                confirm('Вы на самом деле хотите удалить это оборудование?') && this.equipments.splice(index, 1)
            },
            date_format(date) {
                let new_date = ''
                if (date != null) {
                    new_date = date.substr(0, 10)
                } else {
                    new_date = ''
                }
                return new_date
            }
        }
    }
</script >
