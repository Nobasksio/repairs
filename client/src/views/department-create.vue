<template >
    <div >

        <h1 class="display-1" >Создание подразделения</h1 >
        <v-form v-model="valid">

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0">
                        <v-text-field
                                v-model="department.name"
                                label="название"
                                placeholder="например Чайник"
                                outlined
                                :rules="[rules.required, rules.min]"
                                class="mr-2 mb-0"
                        >

                        </v-text-field >
                    </v-col >
                    <!--<v-col cols="4" >-->
                        <!--<v-file-input-->
                                <!--class="d-none"-->
                                <!--v-model="department.logo"-->
                                <!--color="deep-purple accent-4"-->
                                <!--counter-->
                                <!--label="File input"-->
                                <!--multiple-->
                                <!--placeholder="Select your files"-->
                                <!--prepend-icon="mdi-paperclip"-->
                                <!--outlined-->
                                <!--:show-size="1000"/>-->
                        <!--<v-btn color="primary" class="mt-2" @click="">Загрузить лого</v-btn>-->
                    <!--</v-col>-->
                </v-row >
                <v-row>
                    <v-col cols="4">
                        <v-autocomplete
                                label="Родительское подразделение"
                                :items="departments"
                                v-model="department.parent_id"
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
                        Подразделение успешно добавлено
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
                               large
                               :loading="loading"
                               :disabled="loading || !valid"
                               @click="create_department()" >{{name_button}}</v-btn>
                        <deleteButton
                                v-if="load"
                                entity_name_ru="Подразделение"
                                entity_name_eng="department"
                                :want_delete_id="department.id"
                                go_to="settings"
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
        name: "create",
        components:{
            deleteButton,

        },
        props:['load'],
        data: () => {
            return {
                modal: false,
                name_button: 'создать',
                valid:false,
                menu:false,
                menu2:false,
                loading:false,
                succ_alert:false,
                error_alert:false,
                departments:[],
                val_name:false,
                components:[{name:'мяу',id:1},{name:'гав',id:2}],
                department:{
                    name:'',
                    parent_id:{},
                    logo:null,
                    sort:500
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
                })
                .catch(function (error) {
                    console.log(error);
                })
            if (this.load == true){
                axios.get('/api/department/'+this.$route.params.id )
                    .then((response)=> {
                        this.department = response.data.department
                    })
                    .catch((error)=> {
                        console.log(error);
                    })
            }
        },
        methods:{
            makeUniqNumber(){
                let min = 1000000000;
                let max = 9999999999;
                this.equipment.in_number_uniq = Math.floor(Math.random() * (max - min) + min);
            },
            create_department(){
                this.loading = true
                axios.post('/api/department', {department:this.department} )
                    .then((response)=> {
                        console.log(response);
                        this.loading = false
                        this.succ_alert = true
                        this.name_button = 'сохранить'
                    })
                    .catch(function (error) {
                        console.log(error);
                        this.loading = false
                        this.error_alert = true
                    });
            },
        },
        computed:{

        }
    }
</script >

<style scoped >

</style >