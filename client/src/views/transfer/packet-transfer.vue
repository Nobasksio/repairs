<template >
    <div >
        <h1 class="display-1" >Перемещение оборудования</h1 >
        <v-form v-model="valid" >

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-list
                            subheader
                            two-line
                            flat
                    >

                        <v-list-item :key='item.id' v-for="item in choosedEquimpment">
                            <template v-slot:default="{ active, toggle }">

                                <v-list-item-content>
                                    <v-list-item-title>{{item.name}}</v-list-item-title>
                                    <v-list-item-subtitle>{{item.in_number_uniq}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </template>
                        </v-list-item>

                    </v-list>
                </v-row >
                <v-row >

                    <v-col cols="4" >
                        <v-autocomplete
                                label="Перемещаем с"
                                :items="departments"
                                v-model="transfer.from_dep_id"
                                item-text="name"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >

                    <v-col cols="4" >
                        <v-autocomplete
                                label="Подразделение на"
                                :items="filtred_departments_to"
                                v-model="transfer.to_dep_id"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                item-text="name"
                                item-value="id"
                                outlined
                        ></v-autocomplete >
                    </v-col >

                </v-row >
                <v-row >
                    <v-col cols="12" md="8" >
                        <v-textarea
                                outlined
                                v-model="transfer.description"
                                name="input-7-4"
                                class="px-0"
                                label="Описание"
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
                                <div class="flex-grow-1" ></div >
                            </v-date-picker >
                        </v-menu >
                    </v-col >
                </v-row >

                <v-row class="mt-n6 mb-n3" >
                    <v-col cols="" >
                        <v-alert type="success"
                                 transition="scale-transition"
                                 :value="succ_alert"
                        >
                            {{succ_text}}
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
                               :loading="loading"
                               :disabled="loading || !valid"
                               large @click="create_transfer()" >{{name_button}}
                        </v-btn >
                    </v-col >
                </v-row >
            </v-container >
        </v-form >
    </div >
</template >

<script >
    import baseTransfer from './base-transfer';
    import {mapState, mapMutations, mapActions} from 'vuex';

    export default {
        name: "packet-transfer",
        mixins: [baseTransfer],
        mounted(){
            this.transfer.from_dep_id = this.choosedEquimpment[0].department_id
        },
        data() {
            return {
                // id_page: null,
                // modal: false,
                menu: false,
                name_button: 'Сохранить',
                menu2: false,
                valid: false,
                loading: false,
                succ_alert: false,
                succ_text: 'Оборудование успешно добавлено',
                error_alert: false,
                search_name: null,
                search_in_number_uniq: null,
                search_from_dep_id: null,
                filter: {
                    department: null,
                },
                departments: [],
                equipments: [],
                transfer: {
                    id: null,
                    equipment:{id:null},
                    from_dep_id: null,
                    to_dep_id: null,
                    user_id: null,
                    description: null,
                    isDelete: false,
                    date_start: new Date().toISOString().substr(0, 10),
                    date_finish: new Date().toISOString().substr(0, 10),
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        methods:{


            create_transfer() {
                this.HTTP().post('/transfer', {transfer: this.transfer,
                    equipments:this.choosedEquimpment},
                ).then((response) => {

                    if (response.data.action == 'add') {
                        this.succ_text = 'Перемещение успешно проведено'
                    } else {
                        this.succ_text = 'Перемещение успешно обновлено '
                    }

                    this.error_alert = false
                    this.succ_alert = true
                    this.transfer.id = response.data.id
                }).catch((error) => {
                    this.succ_alert = false
                    this.error_alert = true
                    console.log(error);
                });
            },
        },
        computed: {
            ...mapState('lists', ['choosedEquimpment']),
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
            filtred_departments_to() {
                let filtred;

                    filtred = this.departments.filter((item) => {

                        return item.id != this.choosedEquimpment[0].department_id

                    })


                return filtred
            }
        }
    }
</script >

<style scoped >

</style >