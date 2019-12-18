<template >
    <div >
        <h1 class="display-1" >Создание оборудования</h1 >
        <v-dialog v-model="dialog" max-width="50%" >
            <v-card >
                <v-img
                        class="pointer"
                        :src="'http://127.0.0.1:3334/uploads/'+show_photo.link" />
                <v-card-actions >
                    <div class="flex-grow-1" ></div >
                    <v-btn icon align="center" @click="delete_photo(show_photo)" >
                        <v-icon >mdi-trash-can-outline</v-icon >
                    </v-btn >
                    <div class="flex-grow-1" ></div >
                </v-card-actions >
            </v-card >
        </v-dialog >
        <v-dialog
                v-model="dialog_provider"
                max-width="50%"
        >
            <v-card >
                <v-card-text>
                <div class="white pa-2" >
                    <provider-create v-on:added="chooseProvider($event)" ></provider-create >
                </div >
                </v-card-text>
                <v-card-actions >
                    <v-spacer></v-spacer>
                    <v-btn color=" blue darken-1" class="float-left" text @click="dialog_provider = false" >Закрыть</v-btn >
                </v-card-actions >
            </v-card >
        </v-dialog >
        <v-form v-model="valid" >

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0" >
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
                    </v-col >
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
                <v-row >
                    <v-col cols="4" >
                        <v-autocomplete
                                label="Группа"
                                v-model="equipment.type_eq_id"
                                :items="type_eq"
                                item-text="name"
                                :rules="[v => !!v || 'Нужно выбрать группу']"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >
                </v-row >
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
                                :rules="[v => !!v || 'сгенерируйте или ввидети номер']"
                                v-model="equipment.in_number_uniq"
                                placeholder=""
                                outlined
                        >
                        </v-text-field >
                    </v-col >
                    <v-col cols="4" >
                        <v-btn color="primary" class="mt-2" @click="makeUniqNumber" >Сгенирировать номер</v-btn >
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
                                           first-day-of-week="1"
                                           locale="Ru-ru"
                                           @change="menu = false"
                            >
                                <div class="flex-grow-1" ></div >
                            </v-date-picker >
                        </v-menu >
                    </v-col >
                    <v-col cols="2" >
                        <v-checkbox
                                v-model="equipment.noWarranty"
                                label="Нет гарантии"
                        ></v-checkbox >
                    </v-col >
                </v-row >
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
                                :rules="[v => !!v || 'Укажите цену']"
                                v-model="equipment.price"
                        >
                        </v-text-field >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-autocomplete
                                label="Поставщик"
                                :items="providers"
                                v-model="equipment.provider_id"
                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >
                    <v-col cols="4" >
                        <v-btn color="primary" @click="dialog_provider = true" class="mt-2" >Добавить нового</v-btn >
                    </v-col >

                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-autocomplete
                                label="Подразделение"
                                :items="departments"
                                v-model="equipment.department_id"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >
                </v-row >
                <v-row class="mt-n6 mb-n3" >
                    <v-col cols="" >
                        <v-alert type="success"
                                 transition="scale-transition"
                                 :value="succ_alert"
                        >
                            Оборудование успешно добавлено
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
                    <v-col cols="auto" >
                        <v-btn color="primary" class="mt-3 "
                               :loading="loading"
                               v-if="!queue"
                               :disabled="loading || !valid"
                               large @click="create_equipment()" >{{name_button}}
                        </v-btn >
                        <v-btn color="primary" class="mt-3 "
                               :loading="loading"
                               v-else
                               :disabled="loading || !valid"
                               large @click="create_queue_equipment()" >Создать {{ queue_num }} шт
                        </v-btn >
                    </v-col >
                    <v-col cols="auto">
                        <v-switch class="m-n10"
                                v-model="queue"
                                label="Пакетное создание"
                        ></v-switch>
                    </v-col>
                    <v-col cols="auto"  v-if="queue">
                        <v-text-field
                                v-model="queue_num"
                                label="Колличество"
                                outlined
                        ></v-text-field>
                    </v-col>
                </v-row >
            </v-container >
        </v-form >
    </div >
</template >

<script >

    const axios = require('axios');
    import HTTTP from '../../http';
    import providerCreate from '../provider/provider-create'
    // import { mapState } from 'vuex';

    import {mapState, mapMutations, mapActions} from 'vuex';

    export default {
        name: "create",
        components: {
            providerCreate
        },
        data: () => {
            return {
                modal: false,
                menu: false,
                show_photo: {
                    link: '',
                    id: 0
                },
                dialog: false,
                dialog_provider: false,
                name_button: 'создать',
                menu2: false,
                valid: false,
                loading: false,
                succ_alert: false,
                error_alert: false,
                upload_photo: [],
                type_upload_photo: null,
                queue:false,
                queue_num:1,
                equipment: {
                    id: null,
                    name: '',
                    description: null,
                    type_eq_id: null,
                    out_number: null,
                    in_number: null,
                    provider_id: null,
                    in_number_uniq: null,
                    date_buy: new Date().toISOString().substr(0, 10),
                    warranty: null,
                    noWarranty: false,
                    warranty_photo: [],
                    uuid: null,
                    price: null,
                    department_id: null,
                    photo: [],
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        beforeMount() {
            this.fill_lists();

        },
        methods: {
            ...mapMutations('lists', [
                'addProviders', 'addDepartment', 'addTypes'
            ]),
            ...mapActions('lists', ['fill_lists']),
            chooseProvider(provider) {
                console.log(provider)
                this.equipment.provider_id = provider.id
            },
            show_big_photo(photo) {
                this.show_photo = photo
                this.dialog = true
            },
            async makeUniqNumber() {
                let min = 1000000000000,
                    max = 9999999999999,
                    number = Math.floor(Math.random() * (max - min) + min),
                    check = await this.checkUniqNumber(number);

                if (check) {
                    this.equipment.in_number_uniq = number;
                } else {
                    number = Math.floor(Math.random() * (max - min) + min);
                    if (this.checkUniqNumber(number)) {
                        this.equipment.in_number_uniq = number;
                    } else {

                    }
                }
            },
            async checkUniqNumber(number) {
                let check;
                await HTTTP().post('/equipment/checknumber', {number: number})
                    .then((response) => {

                        check = response.data

                    })
                    .catch(function (error) {
                        check = false
                    })

                return check
            },
            create_equipment() {

                HTTTP().post('/equipment',
                    {equipment: this.equipment},
                ).then((response) => {
                    this.loading = false
                    this.succ_alert = true
                    this.name_button = 'сохранить'
                    if (this.queue == false) {
                        this.equipment.id = response.data.id
                    }
                })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false
                        this.error_alert = true
                    });
            },
            async create_queue_equipment(){
                for(let i = 0; i < this.queue_num; i++ ){
                    this.equipment.id = null
                    await this.makeUniqNumber()
                    await this.create_equipment()
                }
            },

            uploat_photo(type) {
                this.type_upload_photo = type
                this.$refs.photo_e.click()

            },
            handleFilesUpload() {
                this.upload_photo = this.$refs.photo_e.files[0];
                this.submitFile()
            },
            // handleFileUpload() {
            //     /*
            //       Set the local file variable to what the user has selected.
            //     */
            //     this.equipment.photo = this.$refs.photo_e.files[0];
            //
            //     console.log(this.equipment.photo)
            //     /*
            //       Initialize a File Reader object
            //     */
            //     let reader = new FileReader();
            //
            //     /*
            //       Add an event listener to the reader that when the file
            //       has been loaded, we flag the show preview as true and set the
            //       image to be what was read from the reader.
            //     */
            //     reader.addEventListener("load", function () {
            //         this.showPreview = true;
            //         this.imagePreview = reader.result;
            //     }.bind(this), false);
            //
            //     /*
            //       Check to see if the file is not empty.
            //     */
            //     if (this.equipment.photo) {
            //         /*
            //           Ensure the file is an image file.
            //         */
            //         if (/\.(jpe?g|png|gif)$/i.test(this.equipment.photo.name)) {
            //             /*
            //               Fire the readAsDataURL method which will read the file in and
            //               upon completion fire a 'load' event which we will listen to and
            //               display the image in the preview.
            //             */
            //             reader.readAsDataURL(this.equipment.photo);
            //
            //         }
            //         this.submitFile()
            //     }
            // },
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
                HTTTP().post('/upload_photo/' + this.type_upload_photo,
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
        },
        computed: {
            // ...mapState('auth',['nameLogin','tokenLogin']),
            ...mapState('lists', ['providers', 'departments', 'type_eq']),
            date_warranty_rules() {
                const rules = []

                if (this.equipment.noWarranty === false) {
                    const rule = value => !!value || 'Поле не может быть пустым'

                    rules.push(rule)
                }
                return rules
            },
            equipment_photo() {
                let photo_arr = this.equipment.photo.filter((item) => {
                    return item.type == 'eq'
                })
                return photo_arr
            },
            warranty_photo() {
                let photo_arr = this.equipment.photo.filter((item) => {
                    return item.type == 'warr'
                })
                return photo_arr
            }
        },
        watch: {
            // equipment: {
            //     handler: function (val, oldVal) {
            //
            //     },
            //     deep: true
            // }

        }
    }
</script >

