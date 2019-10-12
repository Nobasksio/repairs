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
                                :items="equipments"
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
                                label="Внутренний инвентарный номер"
                                placeholder="например 12345"
                                :items="equipments"
                                item-text="in_number_uniq"
                                item-value="id"

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
                                    v-model="transfer.from_dep_id"
                                    item-text="name"
                                    item-value="id"
                                    outlined
                            ></v-autocomplete>
                        </v-col>

                        <v-col cols="4">
                            <v-autocomplete
                                    label="Подразделение на"
                                    :items="departments"
                                    v-model="transfer.to_dep_id"
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
                    <v-col  >
                        <v-btn color="primary" class="m-2"
                               :loading="loading"
                               :disabled="loading || !valid"
                               large @click="create_transfer()" >{{name_button}}</v-btn>
                        <deleteButton
                                entity_name_ru="Перемещение"
                                entity_name_eng="transfer"
                                :want_delete_id="transfer.id"
                        ></deleteButton>
                    </v-col>
                </v-row>
            </v-container >
        </v-form >
    </div >
</template >


<script >
    const axios = require('axios');
    import deleteButton from './delete-button'
    export default {
        name: "transfer-edit",
        components:{
            deleteButton,

        },
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
                    date_start:'',
                    date_finish:''
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        mounted(){
            axios.get('/api/lists')
            .then((response) => {
                this.departments.splice(0, this.departments.length, ...response.data.department);

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
            axios.get('/api/transfer/'+this.$route.params.id )
                .then((response)=> {
                    this.transfer = response.data.transfer
                    this.search_name = this.transfer.equipment_id

                    this.transfer.date_start = this.transfer.date_start.substr(0,10)
                    this.transfer.date_finish = this.transfer.date_finish.substr(0,10)
                })
                .catch((error)=> {
                    console.log(error);
                })
        },
        methods:{
            create_transfer() {
                axios.post('/api/transfer', {transfer: this.transfer})
                    .then((response)=> {
                        console.log(response);

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
            }
        },
        watch:{
            search_name: function(val,oldval){
                console.log('test')
                if (val != oldval) {
                    let eq_serach = this.equipments.filter((item) => {
                        return item.id == val
                    })
                    this.transfer.equipment = eq_serach[0]

                    this.search_in_number_uniq = this.transfer.equipment.id
                }
            },
            search_in_number_uniq: function(val,oldval){
                console.log(val)
                let eq_serach = this.equipments.filter((item)=>{
                    return item.id == val
                })
                this.transfer.equipment = eq_serach[0]

                this.search_name = this.transfer.equipment.id
            }
        }
    }
</script >

<style scoped >

</style >