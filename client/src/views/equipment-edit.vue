<template >
    <div >

        <h1 class="display-1" >Редактирование оборудования</h1 >
        <v-form v-model="valid">

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0">
                        <v-text-field
                                v-model="equipment.name"
                                label="название"
                                placeholder="например Чайник"
                                outlined
                                class="mr-2 mb-0"
                                :rules="[rules.required, rules.min]"
                        >

                        </v-text-field >
                    </v-col >
                    <v-col cols="4" >
                        <input type="file" v-on:change="handleFilesUpload()" class="d-none" ref="photo_e" >
                        <v-btn color="primary" class="mt-2" @click="" @click.native="uploat_photo('eq')" >Загрузить фото
                        </v-btn >
                    </v-col>
                </v-row >
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
                <v-row >
                    <v-col cols="12" md="8" >
                        <v-textarea
                                outlined
                                v-model="equipment.description"
                                name="input-7-4"
                                class="px-0"
                                label="Описание"
                        ></v-textarea >
                    </v-col >
                </v-row >
                <v-row>
                    <v-col cols="4">
                        <v-autocomplete
                                label="Группа"
                                v-model="equipment.type_eq_id"
                                :items="type_eq"
                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="4" >
                        <v-text-field
                                v-model="equipment.out_number"
                                label="заводской серийный номер"
                                placeholder=""
                                outlined
                        >
                        </v-text-field >
                    </v-col >
                    <v-col cols="4" >
                        <v-text-field
                                label="внутренний инвентарный номер"
                                v-model="equipment.in_number_uniq"
                                placeholder=""
                                outlined
                        >
                        </v-text-field >
                    </v-col >
                    <v-col cols="4" >
                        <v-btn color="primary" class="mt-2" @click="makeUniqNumber">Сгенирировать номер</v-btn>
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
                                        label="дата покупки"
                                        outlined
                                        placeholder="гггг-мм-дд"
                                        v-model="equipment.date_buy"
                                        v-on="on"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="equipment.date_buy"
                                           no-title
                                           scrollable
                                           @change="menu = false"
                            >
                                <div class="flex-grow-1"></div>
                            </v-date-picker >
                        </v-menu >
                    </v-col >
                    <v-col cols="2">
                        <v-checkbox
                                v-model="equipment.noWarranty"
                                label="Нет гарантии"
                        ></v-checkbox>
                    </v-col>
                </v-row>
                <v-row >
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
                                        label="дата окончания гарантии"
                                        outlined
                                        placeholder="гггг-мм-дд"
                                        :disabled="equipment.noWarranty"
                                        v-model="equipment.warranty"
                                        v-on="on"
                                        :rules="date_warranty_rules"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="equipment.warranty"
                                           no-title
                                           first-day-of-week="1"
                                           locale="Ru-ru"
                                           scrollable
                                           @change="menu2 = false"
                            >
                                <div class="flex-grow-1" ></div >
                            </v-date-picker >
                        </v-menu >
                    </v-col >
                    <v-col cols="4" >

                        <v-file-input
                                class="d-none"
                                v-model="equipment.warranty_photo"
                                color="deep-purple accent-4"
                                counter
                                label="File input"
                                multiple
                                placeholder="Select your files"
                                prepend-icon="mdi-paperclip"
                                outlined
                                :show-size="1000" />

                        <v-btn color="primary" class="mt-2"
                               :disabled="equipment.noWarranty"
                               @click.native="uploat_photo('warr')"
                        >Прикрепит гарантийник
                        </v-btn >
                    </v-col >
                </v-row >
                <v-row v-if="warranty_photo.length > 0" class="justify-start d-flex mx-2" >

                    <v-card
                            max-width="100"
                            class="pointer"
                            v-for="photo_item in warranty_photo"
                            @click="show_big_photo(photo_item)"
                    >
                        <v-img
                                max-width="100"
                                class="pointer"
                                :src="'http://127.0.0.1:3334/uploads/'+photo_item.link" />
                    </v-card >

                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-text-field
                                label="цена"
                                outlined
                                v-model="equipment.price"
                        >
                        </v-text-field >
                    </v-col >
                </v-row >
                <v-row>
                    <v-col cols="4">
                        <v-autocomplete
                                label="Подразделение"
                                :items="departments"
                                v-model="equipment.department_id"
                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row class="mt-n6 mb-n3" >
                    <v-col cols="" >
                        <v-alert type="success"
                                 transition="scale-transition"
                                 :value="succ_alert"
                        >
                            Оборудование успешно обновлено
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
                               large @click="create_equipment()" >{{name_button}}</v-btn>
                    </v-col>
                </v-row>
            </v-container >
        </v-form >
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
    export default {
        name: "create",
        data: () => {
            return {
                id_page:null,
                modal: false,
                photo_dialog:false,
                show_photo:{},
                menu:false,
                name_button: 'Сохранить',
                menu2:false,
                valid:false,
                loading:false,
                succ_alert:false,
                error_alert:false,
                departments:[],
                type_eq:[],
                upload_photo: [],
                type_upload_photo:null,
                equipment:{
                    name:'',
                    description:null,
                    type_eq:null,
                    out_number:null,
                    in_number:null,
                    in_number_uniq:null,
                    date_buy: new Date().toISOString().substr(0, 10),
                    warranty: null,
                    noWarranty: false,
                    warranty_photo:[],
                    uuid:null,
                    price:null,
                    department_id:null,
                    photo:[],
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        mounted(){
            axios.get('/api/lists' )
                .then((response)=> {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.type_eq.splice(0, this.type_eq.length, ...response.data.type);
                })
                .catch((error) =>  {
                    console.log(error);
                })

            axios.get('/api/equipment/'+this.$route.params.id )
                .then((response)=> {
                    this.equipment = response.data.equipment
                    // this.equipment.photo.splice(0, this.equipment.photo.length, ...response.data.photo);
                    this.equipment.date_buy = this.equipment.date_buy.substr(0,10)
                    if (this.equipment.warranty !=null) {
                        this.equipment.warranty = this.equipment.warranty.substr(0, 10)
                    }
                })
                .catch((error)=> {
                    console.log(error);
                })
        },
        methods:{
            makeUniqNumber(){
                let min = 1000000000;
                let max = 9999999999;
                this.equipment.in_number_uniq = Math.floor(Math.random() * (max - min) + min);
            },
            show_big_photo(photo){
                this.show_photo = photo
                this.photo_dialog = true
            },
            create_equipment(){

                axios.post('/api/equipment', {equipment:this.equipment},
                    {
                        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                    })
                    .then((response)=> {
                        this.loading = false
                        this.succ_alert = true
                        this.name_button = 'сохранить'
                    })
                    .catch((error)=> {
                        console.log(error);
                        this.loading = false
                        this.error_alert = true
                    });
            },
            uploat_photo(type) {
                this.type_upload_photo = type
                this.$refs.photo_e.click()

            },
            handleFilesUpload() {
                this.upload_photo = this.$refs.photo_e.files[0];
                this.submitFile()
            },

            submitFile() {
                /*
                  Initialize the form data
                */
                let formData = new FormData();
                let self = this;

                /*
                  Add the form data we need to submit
                */
                formData.append('file', this.upload_photo);


                /*
                  Make the request to the POST /single-file URL
                */
                this.uploading = true
                axios.post('/api/upload_photo/'+this.type_upload_photo,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then(response => {
                    console.log('SUCCESS!!');
                    this.equipment.photo.push(response.data)

                }).catch(function (error) {
                    console.log('FAILURE!!');
                    alert('хуйня')

                });
            },
            delete_photo(photo){
                axios.delete('/api/photo/'+photo.id,
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
        },
        computed:{
            date_warranty_rules(){
                const rules = []

                if (this.equipment.noWarranty == false){
                    const rule =
                        value => !!value || 'Поле не может быть пустым'

                    rules.push(rule)
                }
                return rules
            },
            equipment_photo(){
                console.log('test1');
                let photo_arr = (this.equipment.photo).filter((item)=>{
                    return item.type == 'eq'
                })
                return photo_arr
            },
            warranty_photo(){
                console.log('test');
                let photo_arr = (this.equipment.photo).filter((item)=>{
                    return item.type == 'warr'
                })
                return photo_arr
            }
        },
        watch:{
            equipment:{
                handler: function (val, oldVal) {
                    console.log(val)
                },
                deep: true
            },
        }
    }
</script >

<style scoped >

</style >