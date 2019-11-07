<template >
    <div >
        <h1 class="display-1" >Редактирование оборудования</h1 >
        <v-tabs
                v-model="tab"
        >
            <v-tabs-slider ></v-tabs-slider >
            <v-tab href="#tab-1" >Информация об оборудовании</v-tab >
            <v-tab href="#tab-2" >Ремонты</v-tab >
            <v-tab href="#tab-3" >Перемещения</v-tab >
        </v-tabs >

        <v-tabs-items v-model="tab" >
            <v-tab-item value="tab-1" >
                <v-card flat >
                    <v-simple-table >

                        <template v-slot:default >
                            <thead >
                            <tr >
                                <th class="text-left" >Поле</th >
                                <th class="text-left" >Значение</th >
                            </tr >
                            </thead >
                            <tbody >
                            <tr v-for="item in table" :key="item.name" >
                                <td class="font-weight-bold" >{{ item.lable }}</td >
                                <td >{{ equipment[item.name] }}</td >
                            </tr >
                            <tr >
                                <td class="font-weight-bold" >Внутренний номер</td >
                                <td >
                                    <barcode :value="equipment.in_number_uniq"
                                             :options="{ displayValue: true, width:3, height:70 }"></barcode>
                                </td >
                            </tr >
                            <tr >
                                <td class="font-weight-bold" >Гарантия действует</td >
                                <td >{{ equipment.noWarranty ? 'Нет': 'Да'  }}</td >
                            </tr >
                            <tr >
                                <td class="font-weight-bold" >Подразделение</td >
                                <td >{{ equipment.department.name }}</td >
                            </tr >
                            <tr >
                                <td class="font-weight-bold" >Тип</td >
                                <td >{{ equipment.typeEq.name }}</td >
                            </tr >
                            <tr >
                                <td class="font-weight-bold" >Фото</td >
                                <td >
                                    <v-row v-if="equipment_photo.length > 0" class="justify-start d-flex mx-2" >

                                        <v-card
                                                max-width="100"
                                                class="pointer"
                                                v-for="photo_item in equipment_photo"
                                                @click="show_big_photo(photo_item)"
                                        >
                                            <v-img
                                                    max-width="100"
                                                    class="pointer"
                                                    :src="'http://127.0.0.1:3334/uploads/'+photo_item.link" />
                                        </v-card >

                                    </v-row >
                                </td >
                            </tr >
                            <tr >
                                <td class="font-weight-bold" >Гарантийные талоны</td >
                                <td >
                                    <v-row v-if="warranty_photo.length > 0" class="justify-start d-flex mx-2" >

                                        <v-card
                                                max-width="100"
                                                class="pointer"
                                                :key="photo_item.id"
                                                v-for="photo_item in warranty_photo"
                                                @click="show_big_photo(photo_item)"
                                        >
                                            <v-img
                                                    max-width="100"
                                                    class="pointer"
                                                    :src="'http://127.0.0.1:3334/uploads/'+photo_item.link" />
                                        </v-card >

                                    </v-row >
                                </td >
                            </tr >
                            </tbody >
                        </template >
                    </v-simple-table >
                    <v-row >
                        <v-col cols="" >
                            <v-btn color="primary" class="m-2 mx-5"
                                   :loading="loading"
                                   @click="editItem(equipment.id)"
                                   large >{{name_button}}
                            </v-btn >
                            <deleteButton
                                    entity_name_ru="оборудование"
                                    entity_name_eng="equipment"
                                    :want_delete_id="equipment.id"
                            ></deleteButton>
                        </v-col >
                    </v-row >
                </v-card >
            </v-tab-item >
            <v-tab-item value="tab-2" >
                <div class="display-1 py-5 px-3">
                    сумма ремонта {{ all_summ_rapairs }} руб
                </div>
                <v-data-table
                        :headers="headers"
                        :items="equipment.repairs"
                        :items-per-page="5"
                        class="elevation-1"
                >
                    <template v-slot:item.date_start="{ item }" >
                        {{ date_format(item.date_start)}}
                    </template >
                    <template v-slot:item.date_finish="{ item }" >
                        {{ date_format(item.date_finish)}}
                    </template >
                    <template v-slot:item.isWarranty="{ item }" >
                        {{ item.isWarranty ? 'Да': 'Нет'}}
                    </template >
                    <template v-slot:item.action="{ item }">
                        <!--<v-icon-->
                                <!--small-->
                                <!--class="mx-5"-->
                                <!--@click="editRepairs(item.id)"-->
                        <!--&gt;-->
                            <!--more_horiz-->
                        <!--</v-icon>-->
                        <v-icon
                                small
                                class="mr-5"
                                @click="editRepairs(item.id)"
                        >
                            edit
                        </v-icon>
                    </template>

                </v-data-table >

            </v-tab-item >
            <v-tab-item value="tab-3" >
                <v-data-table
                        :headers="table_transfer"
                        :items="transfers"
                        :items-per-page="5"
                        class="elevation-1"
                >
                    <template v-slot:item.name="{ item }">
                        {{ equipment.name }}
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
                    </template>r
                    <template v-slot:item.action="{ item }">
                        <!--<v-icon-->
                                <!--small-->
                                <!--class="mx-5"-->
                                <!--@click="editTransfer(item.id)"-->
                        <!--&gt;-->
                            <!--more_horiz-->
                        <!--</v-icon>-->
                        <v-icon
                                small
                                class="mr-5"
                                @click="editTransfer(item.id)"
                        >
                            edit
                        </v-icon>
                    </template>

                </v-data-table >
            </v-tab-item >
        </v-tabs-items >
        <v-dialog v-model="photo_dialog" max-width="50%">
            <v-card>
                <v-img
                        class="pointer"
                        :src="'http://127.0.0.1:3334/uploads/'+show_photo.link" />
                <v-card-actions >
                    <div class="flex-grow-1"></div>
                    <v-btn icon align="center" @click="delete_photo(show_photo)">
                        <v-icon >mdi-trash-can-outline</v-icon >
                    </v-btn >
                    <div class="flex-grow-1"></div>
                </v-card-actions >
            </v-card>
        </v-dialog>
    </div >
</template >

<script >
    const axios = require('axios');
    import HTTTP from '../http';
    import deleteButton from './delete-button'
    import VueBarcode from '@xkeshi/vue-barcode';



    export default {
        name: "create",
        components:{
            deleteButton,
            'barcode':VueBarcode
        },
        data: () => {
            return {
                tab: null,
                id_page: null,
                photo_dialog:false,
                show_photo:{},
                modal: false,
                menu: false,
                name_button: 'Изменить',

                want_delete_id:null,
                loading: false,
                succ_alert: false,
                error_alert: false,
                departments: [],
                class_eq: [],
                type_eq: [],
                transfers:[],
                equipment: {
                    name: '',
                    description: null,
                    classEq: {},
                    typeEq: {},
                    out_number: null,
                    in_number: null,
                    in_number_uniq: null,
                    department:{},
                    repairs:[],
                    date_buy: new Date().toISOString().substr(0, 10),
                    warranty: null,
                    noWarranty: false,
                    warranty_photo: [],
                    uuid: null,
                    price: null,
                    department_id: null,
                    photo: [],
                },
                headers: [
                    {text: 'Описание', value: 'description'},
                    {
                        text: 'Дата начала',
                        align: 'left',
                        value: 'date_start',
                    },
                    {text: 'конец', value: 'date_finish'},
                    {text: 'Гарантийный', value: 'isWarranty'},
                    {text: 'Сумма', value: 'price'},
                    {text: 'Действия', value: 'action'},
                ],
                table: [
                    {
                        name: 'name',
                        lable: 'Название'
                    },
                    {
                        name: 'description',
                        lable: 'Описание'
                    },
                    {
                        name: 'out_number',
                        lable: 'Заводской мерийный номер'
                    },
                    {
                        name: 'in_number_uniq',
                        lable: 'Внутренний номер'
                    },
                    {
                        name: 'date_buy',
                        lable: 'Дата покупки'
                    },
                    {
                        name: 'warranty',
                        lable: 'Дата окончания гарантии'
                    },
                    {
                        name: 'price',
                        lable: 'Цена'
                    },
                    {
                        name: 'department_id',
                        lable: 'Накопленная сумма ремонта'
                    },
                ],
                table_transfer: [
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
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        mounted() {
            HTTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.type_eq.splice(0, this.type_eq.length, ...response.data.type);
                })
                .catch((error) => {
                    console.log(error);
                })

            HTTTP().get('/equipment/' + this.$route.params.id)
                .then((response) => {
                    this.equipment = response.data.equipment
                    this.equipment.department = response.data.equipmentDepartments
                    this.equipment.typeEq = response.data.typeEq
                    this.equipment.repairs = response.data.repairs
                    this.equipment.photo = response.data.photo

                    this.transfers = response.data.transfers

                    this.equipment.date_buy = this.equipment.date_buy.substr(0,10)

                    if (this.equipment.warranty != null) {
                        this.equipment.warranty = this.equipment.warranty.substr(0, 10)
                    }

                })
                .catch((error) => {
                    console.log(error);
                })

            var { createCanvas } = require("canvas");
            var canvas = createCanvas();
            JsBarcode(canvas, "Hello");



        },
        methods: {
            makeUniqNumber() {
                let min = 1000000000;
                let max = 9999999999;
                this.equipment.in_number_uniq = Math.floor(Math.random() * (max - min) + min);
            },
            show_big_photo(photo){
                this.show_photo = photo
                this.photo_dialog = true
            },
            create_equipment() {

                HTTTP().post('/equipment', {equipment: this.equipment})
                    .then((response) => {
                        this.loading = false
                        this.succ_alert = true
                        this.name_button = 'сохранить'
                    })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false
                        this.error_alert = true
                    });
            },
            editItem(id) {
                console.log(id)
                this.$router.push('/equipment/edit/' + id)
            },
            editRepairs(id) {
                console.log(id)
                this.$router.push('/repair/edit/' + id)
            },
            editTransfer(id) {
                console.log(id)
                this.$router.push('/transfer/edit/' + id)
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
            delete_photo(photo){
                HTTTP().delete('/photo/'+photo.id,
                ).then((response) => {


                    this.equipment.photo.forEach((item, i, arr)=>{
                        if (item.id == photo.id){
                            this.equipment.photo.splice(i,1)
                        }
                    })
                    this.photo = {
                        id:0,
                        link:''
                    }
                    this.photo_dialog = false
                })
                    .catch((error) => {
                        console.log(error);

                        this.error_alert = true
                    });
            },
            getEquipment(equipment_id) {
                let our_equipment = this.equipments.filter((item) => {
                    return item.id == equipment_id
                })
                return our_equipment[0]
            },
            getDepartment(department_id) {
                let our_department = []

                our_department = this.departments.filter((item) => {
                    return item.id == department_id
                })
                return our_department[0]
            },
        },
        watch: {
            equipment: {
                handler: function (val, oldVal) {
                    console.log(val)
                },
                deep: true
            },
        },
        computed: {
            equipment_photo() {
                let photo_arr1 = this.equipment.photo.filter((item) => {
                    return item.type == 'eq'
                })
                return photo_arr1
            },
            warranty_photo() {
                let photo_arr = this.equipment.photo.filter((item) => {
                    return item.type == 'warr'
                })
                return photo_arr
            },
            all_summ_rapairs(){
                let all_summ = 0
                if (this.equipment.repairs) {
                    this.equipment.repairs.forEach((item, i, arr) => {
                        all_summ += item.price
                    })
                }

                return all_summ
            }
        }
    }
</script >

<style scoped >

</style >