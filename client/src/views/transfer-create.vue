<template >
    <div >

        <h1 class="display-1" >Перемещение оборудования</h1 >
        <v-form v-model="valid">

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0" >

                        <v-autocomplete
                                v-model="search_name"
                                label="Название"
                                placeholder="например Чайник"
                                :items="filter_equipments"
                                item-text="name"
                                item-value="id"
                                outlined
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                class="mr-2 mb-0"
                        >
                            <template v-slot:item="data">
                                <template>
                                    <v-list-item-content>
                                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                        <v-list-item-subtitle v-html="(getDepartment(data.item.department_id)).name"></v-list-item-subtitle>
                                    </v-list-item-content>
                                </template>
                            </template>
                        </v-autocomplete>
                    </v-col >
                    <v-col cols="4" >
                        <v-autocomplete
                                v-model="search_in_number_uniq"
                                label="Внутренний инвентарный номер"
                                placeholder="например 12345"
                                :items="filter_equipments"
                                item-text="in_number_uniq"
                                item-value="id"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                outlined
                                class="mr-2 mb-0"
                        ></v-autocomplete>
                    </v-col >
                    <!--<v-col class="mt-2" >-->
                    <!--<v-btn color="primary" @click="" >найти</v-btn >-->
                    <!--</v-col >-->
                </v-row >
                <v-row >

                        <v-col cols="4">
                            <v-autocomplete
                                    label="Перемещаем с"
                                    :items="departments"
                                    v-model="search_from_dep_id"
                                    item-text="name"
                                    :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                    item-value="id"
                                    outlined
                            ></v-autocomplete>
                        </v-col>

                        <v-col cols="4">
                            <v-autocomplete
                                    label="Подразделение на"
                                    :items="filtred_departments_to"
                                    v-model="transfer.to_dep_id"
                                    :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                    item-text="name"
                                    item-value="id"
                                    outlined
                            ></v-autocomplete>
                        </v-col>

                </v-row >
                <v-row>
                    <v-col cols="12" md="8" >
                        <v-textarea
                                outlined
                                v-model="transfer.description"
                                name="input-7-4"
                                class="px-0"
                                label="Описание"
                        ></v-textarea >
                    </v-col >
                </v-row>
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
                                        label="дата когда забрали"
                                        outlined
                                        placeholder="гггг-мм-дд"
                                        v-model="transfer.date_start"
                                        v-on="on"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="transfer.date_start"
                                           no-title
                                           scrollable
                                           @change="menu = false"
                            >
                                <div class="flex-grow-1"></div>
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
                                        label="дата когда привезли"
                                        outlined
                                        placeholder="гггг-мм-дд"
                                        v-model="transfer.date_finish"
                                        v-on="on"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="transfer.date_finish"
                                           no-title
                                           scrollable
                                           @change="menu2 = false"
                            >
                                <div class="flex-grow-1"></div>
                            </v-date-picker >
                        </v-menu >
                    </v-col >
                </v-row>

                <v-row class="mt-n6 mb-n3" >
                    <v-col cols="" >
                        <v-alert type="success"
                                 transition="scale-transition"
                                 :value="succ_alert"
                        >
                            {{succ_text}}
                        </v-alert>
                        <v-alert type="error"
                                 transition="scale-transition"
                                 :value="error_alert"
                        >
                            При сохранении возникли проблемы. Попробуйте ещё раз или обратитесь в поддержку.
                        </v-alert>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4" >
                        <v-btn color="primary" class="m-2"
                               :loading="loading"
                               :disabled="loading || !valid"
                               large @click="create_transfer()" >{{name_button}}</v-btn>
                    </v-col>
                </v-row>
            </v-container >
        </v-form >
    </div >
</template >


<script >
    const axios = require('axios');
    import HTTTP from '../http';
    export default {
        name: "transfer-create",
        data: () => {
            return {
                id_page:null,
                modal: false,
                menu:false,
                name_button: 'Сохранить',
                menu2:false,
                valid:false,
                loading:false,
                succ_alert:false,
                succ_text:'Оборудование успешно добавлено',
                error_alert:false,
                search_name: null,
                search_in_number_uniq: null,
                search_from_dep_id: null,
                filter: {
                    department: null,
                },
                departments:[],
                equipments:[],
                transfer:{
                    id:null,
                    from_dep_id:null,
                    to_dep_id:null,
                    equipment:{id:null},
                    user_id:null,
                    description:null,
                    isDelete:false,
                    date_start:new Date().toISOString().substr(0, 10),
                    date_finish:new Date().toISOString().substr(0, 10),
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        mounted(){
            HTTTP().get('/lists')
            .then((response) => {
                this.departments.splice(0, this.departments.length, ...response.data.department);

            })
            .catch(function (error) {
                console.log(error);
            })
            HTTTP().get('/equipments')
                .then((response) => {
                    this.equipments.splice(0, this.equipments.length, ...response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        methods:{
            create_transfer() {
                HTTTP().post('/transfer', {transfer: this.transfer},
                   )
                    .then((response)=> {


                        if (response.data.action == 'add'){
                            this.succ_text = 'Перемещение успешно проведено'
                        } else {
                            this.succ_text = 'Перемещение успешно обновлено '
                        }
                        this.error_alert = false
                        this.succ_alert = true

                        this.transfer.id = response.data.id
                    })
                    .catch((error)=> {
                        this.succ_alert = false
                        this.error_alert = true
                        console.log(error);
                    });
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
        },
        watch:{
            search_name: function(val,oldval){

                if (val != oldval) {
                    let eq_serach = this.equipments.filter((item) => {
                        return item.id == val
                    })
                    this.transfer.equipment = eq_serach[0]

                    this.search_in_number_uniq = this.transfer.equipment.id
                    this.search_from_dep_id = this.transfer.equipment.department_id
                    this.transfer.from_dep_id = this.transfer.equipment.department_id
                }
            },
            search_in_number_uniq: function(val,oldval){

                let eq_serach = this.equipments.filter((item)=>{
                    return item.id == val
                })
                this.transfer.equipment = eq_serach[0]
                this.search_name = this.transfer.equipment.id
                this.search_from_dep_id = this.transfer.equipment.department_id
                this.transfer.from_dep_id = this.transfer.equipment.department_id

            },
            search_from_dep_id: function (val, oldval) {

                this.filter.department = val

                if (val != this.transfer.equipment.department_id){
                    this.transfer.equipment = {id:null}

                }
                this.transfer.from_dep_id = val

            }
        },
        computed:{
            filter_equipments() {
                let filtred;

                if (this.filter.department != null) {
                    filtred = this.equipments.filter((item) => {
                        let step = false;

                        if (item.department_id == this.filter.department) {
                            step = true

                        }

                        return step

                    })
                } else {
                    filtred = this.equipments
                }

                return filtred
            },
            filtred_departments_to(){
                let filtred;
                if (this.transfer.equipment.id != null) {
                    filtred = this.departments.filter((item) => {

                        return item.id != this.transfer.equipment.department_id

                    })
                } else {
                    filtred = this.departments
                }

                return filtred
            }
        }
    }
</script >

<style scoped >

</style >