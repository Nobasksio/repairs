<template >
    <div >
        <h1 class="display-1" >Редактирование ремонта</h1 >
        <v-form >

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0" >

                        <v-autocomplete
                                v-model="search_name"
                                label="внутренний инвентарный номер"
                                placeholder="например Чайник"
                                :items="equipments"
                                readonly
                                item-text="name"
                                item-value="id"
                                outlined
                                class="mr-2 mb-0"
                        >
                            <template v-slot:item="data">
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title v-html="data.item.name +' - ' +data.item.department_id"></v-list-item-title>
                                        <v-list-item-subtitle v-html="data.item.department_id"></v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </template>
                        </v-autocomplete>
                    </v-col >
                    <v-col cols="4" >
                        <v-autocomplete
                                v-model="search_in_number_uniq"
                                label="внутренний инвентарный номер"
                                placeholder="например 12345"
                                :items="equipments"
                                item-text="in_number_uniq"
                                item-value="id"
                                readonly
                                outlined
                                class="mr-2 mb-0"
                        ></v-autocomplete>
                    </v-col >
                    <!--<v-col class="mt-2" >-->
                        <!--<v-btn color="primary" @click="" >найти</v-btn >-->
                    <!--</v-col >-->
                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-autocomplete
                                label="Подразделение"
                                :items="departments"
                                v-model="repairs.department_id"
                                item-text="name"
                                readonly
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="12" md="8" >
                        <v-textarea
                                outlined
                                v-model="repairs.description"
                                name="input-7-4"
                                class="px-0"
                                label="Описание проблемы"
                        ></v-textarea >
                    </v-col >
                </v-row >
                <v-row >
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
                                        label="дата начала ремонта"
                                        outlined
                                        v-model="repairs.date_start"
                                        placeholder="гггг-мм-дд"
                                        v-on="on"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="repairs.date_start"
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
                                        label="дата окончания ремонта"
                                        outlined
                                        placeholder="гггг-мм-дд"
                                        v-model="repairs.date_finish"
                                        v-on="on"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="repairs.date_finish"
                                           no-title
                                           scrollable
                                           @change="menu2 = false"
                            >
                                <div class="flex-grow-1" ></div >
                            </v-date-picker >
                        </v-menu >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-autocomplete
                                label="Подрядчик"
                                :items="providers"
                                v-model="repairs.provider_id"
                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >
                    <v-col cols="4" >
                        <v-btn color="primary" @click="" class="mt-2" >Добавить нового</v-btn >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-text-field
                                v-model="repairs.price"
                                label="Сумма"
                                placeholder=""
                                outlined
                                class="mr-2 mb-0"
                        >
                        </v-text-field >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col class="pt-0" >
                        <v-checkbox
                                class="pt-0"
                                v-model="repairs.isWarranty"
                                label="Гарантийный ремонт"
                        ></v-checkbox >
                    </v-col >
                </v-row >
                <v-row class="mt-n6 mb-n3" >
                    <v-col cols="" >
                        <v-alert type="success"
                                 transition="scale-transition"
                                 :value="succ_alert"
                        >
                            Ремонт успешно сохранен
                        </v-alert >
                        <v-alert type="error"
                                 transition="scale-transition"
                                 :value="error_alert"
                        >
                            При сохранении возникли проблемы. Попробуйте ещё раз или обратитесь в поддержку.
                        </v-alert >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col  >
                        <v-btn color="primary" class="m-2" large @click="create_repair()" >Сохранить</v-btn >
                        <deleteButton

                                entity_name_ru="Ремонт"
                                entity_name_eng="repair"
                                :want_delete_id="repairs.id"
                        ></deleteButton>
                    </v-col >

                </v-row >
            </v-container >
        </v-form >
    </div >
</template >

<script >
    const axios = require('axios');
    import deleteButton from './delete-button'
    export default {
        name: "create",
        components:{
            deleteButton,

        },
        data: () => {
            return {
                modal: false,
                menu: false,
                menu2: false,
                succ_alert:false,
                error_alert:false,
                search_name: null,
                search_in_number_uniq: null,
                departments:[],
                equipments:[],
                repair_id:null,
                providers:[],
                repairs: {
                    id:null,
                    equipment: {},
                    description: null,
                    isWarranty:false,
                    date_start: new Date().toISOString().substr(0, 10),
                    date_finish: null,
                    warranty_photo: [],
                    price: null,
                }
            }
        },
        mounted() {
            axios.get('/api/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.providers = response.data.providers
                })
                .catch(function (error) {
                    console.log(error);
                })
            axios.get('/api/equipments')
                .then((response) => {
                    this.equipments.splice(0, this.equipments.length, ...response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })
            axios.get('/api/repair/'+this.$route.params.id )
                .then((response)=> {
                    this.repairs = response.data.repair
                    this.search_name = this.repairs.equipment_id

                    this.repairs.date_start = this.repairs.date_start.substr(0,10)
                    this.repairs.date_finish = this.repairs.date_finish.substr(0,10)
                })
                .catch((error)=> {
                    console.log(error);
                })

        },
        methods: {
            makeUniqNumber() {
                let min = 1000000000;
                let max = 9999999999;
                this.equipment.in_number_uniq = Math.floor(Math.random() * (max - min) + min);
            },
            create_repair() {
                axios.post('/api/repair', {repair: this.repairs})
                    .then((response)=> {
                        console.log(response);
                        this.error_alert = false
                        this.succ_alert = true

                        this.repairs.id = response.data.id
                    })
                    .catch((error)=> {
                        this.succ_alert = false
                        this.error_alert = true
                        console.log(error);
                    });
            }
        },
        watch:{
            search_name: function(val,oldval){
                console.log('test')
                if (val != oldval) {
                    let eq_serach = this.equipments.filter((item) => {
                        return item.id == val
                    })
                    this.repairs.equipment = eq_serach[0]

                    this.search_in_number_uniq = this.repairs.equipment.id
                }
            },
            search_in_number_uniq: function(val,oldval){
                console.log(val)
                let eq_serach = this.equipments.filter((item)=>{
                    return item.id == val
                })
                this.repairs.equipment = eq_serach[0]

                this.search_name = this.repairs.equipment.id
            }
        }
    }
</script >

<style scoped >

</style >