<template >
    <div >

        <h1 class="display-1" >Создание ремонта</h1 >
        <v-form v-model="valid" >

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0" >

                        <v-autocomplete
                                v-model="search_name"
                                label="Название"
                                placeholder="например Чайник"
                                :items="filter_equipments"
                                item-text="name"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                item-value="id"
                                outlined
                                class="mr-2 mb-0"
                        >
                            <template v-slot:item="data" >
                                <template >
                                    <v-list-item-content >
                                        <v-list-item-title v-html="data.item.name" ></v-list-item-title >
                                        <v-list-item-subtitle
                                                v-html="(getDepartment(data.item.department_id)).name" ></v-list-item-subtitle >
                                    </v-list-item-content >
                                </template >
                            </template >
                        </v-autocomplete >
                    </v-col >
                    <v-col cols="4" >
                        <v-autocomplete
                                v-model="search_in_number_uniq"
                                label="внутренний инвентарный номер"
                                placeholder="например 12345"
                                :items="filter_equipments"
                                item-text="in_number_uniq"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                item-value="id"
                                outlined
                                class="mr-2 mb-0"
                        ></v-autocomplete >
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
                                v-model="filter.department"

                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >
                    <v-col>
                        <v-btn color="primary" class="mt-1"
                               v-if="filter.department != null"
                               large @click="clean()" >очистить
                        </v-btn >
                    </v-col>

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
                                        placeholder="гггг-мм-дд"
                                        outlined
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
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
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
                            Ремонт успешно создан
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
                    <v-col cols="4" >
                        <v-btn color="primary" class="m-2"
                               :disabled="loading || !valid"
                               large @click="create_repair()" >Сохранить
                        </v-btn >
                    </v-col >
                </v-row >
            </v-container >
        </v-form >
    </div >
</template >

<script >
    const axios = require('axios');
    export default {
        name: "create",
        data: () => {
            return {
                modal: false,
                menu: false,
                menu2: false,
                succ_alert: false,
                error_alert: false,
                search_name: null,
                search_in_number_uniq: null,
                loading: false,
                valid: false,
                filter: {
                    department: null,
                },
                departments: [],
                equipments: [],
                providers: [],
                repairs: {
                    id: null,
                    equipment: {},
                    description: null,
                    isWarranty: false,
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
                    this.providers.splice(0, this.providers.length, ...response.data.providers);
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
        },
        methods: {
            makeUniqNumber() {
                let min = 1000000000;
                let max = 9999999999;
                this.equipment.in_number_uniq = Math.floor(Math.random() * (max - min) + min);
            },
            create_repair() {
                axios.post('/api/repair', {repair: this.repairs},
                    {
                        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                    })
                    .then((response) => {
                        console.log(response);
                        this.error_alert = false
                        this.succ_alert = true

                        this.repairs.id = response.data.id
                    })
                    .catch((error) => {
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
                if (our_department.length == 0) {
                    our_department = [{name: 'подразделение удалено'}]
                }

                return our_department[0]
            },
            clean(){
                this.filter.department = null
                this.repairs.equipment = {}
                this.search_name = null
                this.search_in_number_uniq = null
            }
        },
        watch: {
            search_name: function (val, oldval) {
                console.log('test')
                if (val != oldval) {
                    let eq_serach = this.equipments.filter((item) => {
                        return item.id == val
                    })
                    this.repairs.equipment = eq_serach[0]

                    this.search_in_number_uniq = this.repairs.equipment.id
                    this.filter.department = this.repairs.equipment.department_id
                }
            },
            search_in_number_uniq: function (val, oldval) {
                console.log(val)
                let eq_serach = this.equipments.filter((item) => {
                    return item.id == val
                })
                this.repairs.equipment = eq_serach[0]

                this.search_name = this.repairs.equipment.id
                this.filter.department = this.repairs.equipment.department_id
            }
        },
        computed: {
            filter_equipments() {
                let filtred;

                if (this.filter.department != null) {
                    filtred = this.equipments.filter((item) => {
                        let step = false;

                        if (item.department_id == this.filter.department) {
                            step = true
                            console.log(1213)
                        }
                        console.log(1213)
                        return step

                    })
                } else {
                    filtred = this.equipments
                }

                return filtred
            }
        }
    }
</script >

<style scoped >

</style >