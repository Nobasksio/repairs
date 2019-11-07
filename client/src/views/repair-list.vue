<template >
    <div>
        <v-row >
            <v-col cols="2" >
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
            <v-col cols="2" >
                <v-autocomplete
                        label="группа"
                        :items="group_eq"
                        v-model="filter.group"
                        chips
                        small-chips
                        multiple
                        item-text="name"
                        item-value="id"
                        outlined
                ></v-autocomplete >
            </v-col >
            <v-col cols="2" >
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
            <v-col cols="2" >
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
            <v-col>
                <div class="caption text-center">
                    сумма оборудования <br>
                    <span class="font-weight-black">{{ summ_filtred }} руб</span>
                </div>
            </v-col>
            <v-col>
                <v-btn color="primary" class="mt-1"

                       large @click="clean()" >очистить
                </v-btn >
            </v-col>
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
    import HTTTP from '../http';
    var moment = require('moment');
    export default {
        name: "repair-list",
        data () {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                menu:false,
                menu2:false,
                group_eq:[],
                filter: {
                    department: [],
                    group:[],
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
            HTTTP().get('/lists')
                .then((response) => {
                    this.group_eq.splice(0, this.group_eq.length, ...response.data.type);
                })
                .catch((error) => {
                    console.log(error);
                })
            HTTTP().get('/repair/')
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
                if (our_equipment.length == 0){
                    our_equipment = [{name:''}]
                }
                return our_equipment[0]
            },
            getDepartment(department_id) {
                let our_department = []

                our_department = this.department.filter((item) => {
                    return item.id == department_id
                })
                if (our_department.length == 0){
                    our_department = [{name:'подразделение удалено'}]
                }

                return our_department[0]
            },
            getProvider(provider_id){
                let our_provider = []
                our_provider = this.providers.filter((item) => {
                    return item.id == provider_id
                })
                if (our_provider.length == 0){
                    our_provider = [{name:'поcтавщик удален'}]
                }
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
            },
            clean(){
                this.filter.department = []
                this.filter.group = []
                this.filter.date_start = null
                this.filter.date_finish = null

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

                if (this.filter.group.length > 0) {
                    filtred = filtred.filter((item) => {
                        let step = false;
                        for(let i = 0; i < this.filter.group.length;i++  ){

                            let equip = this.getEquipment(item.equipment_id)
                            if  (equip.type_eq_id == this.filter.group[i]){
                                console.log('1111')
                                step = true
                                break;
                            }
                        }
                        return step

                    })
                }



                if (this.filter.date_start != null){
                    console.log(moment(this.filter.date_start))
                    filtred = filtred.filter((item)=>{
                        console.log(moment(item.date_start.substr(0,10)))
                        if( moment(item.date_start.substr(0,10)) >= moment(this.filter.date_start)){
                            return true
                        }

                    })
                }

                if (this.filter.date_finish != null){
                    filtred = filtred.filter((item)=>{

                        if( moment(item.date_start.substr(0,10)) <= moment(this.filter.date_finish)){
                            return true
                        }

                    })
                }

                return filtred
            },
            summ_filtred(){
                let summ = 0

                this.filter_equipments.forEach((item, i, arr)=>{
                    summ = summ + item.price
                })

                return summ
            }
        }
    }
</script >

<style scoped >

</style >