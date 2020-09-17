<template >
    <div >
        <h1 class="display-1" >Списание оборудования</h1 >
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
                    <v-col cols="12" md="8" >
                        <v-textarea
                                outlined
                                v-model="outOfOrderComment"
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
                                        label="дата списания"
                                        outlined
                                        placeholder="гггг-мм-дд"
                                        v-model="date_out"
                                        v-on="on"
                                >
                                </v-text-field >
                            </template >
                            <v-date-picker v-model="date_out"
                                           no-title
                                           scrollable
                                           @change="menu = false"
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
                <v-progress-linear
                        v-if="loading"
                        color="light-blue"
                        height="10"
                        :value="progress"
                        striped
                ></v-progress-linear>
                <v-row >
                    <v-col cols="4" >
                        <v-btn color="primary" class="m-2"
                               :loading="loading"
                               :disabled="loading || !valid"
                               large @click="makeAll()" >{{name_button}}
                        </v-btn >
                    </v-col >
                </v-row >
            </v-container >
        </v-form >
    </div >
</template >

<script >
    import {mapState, mapMutations, mapActions} from 'vuex';

    export default {
        name: "packet-transfer",
        mounted(){

        },
        data() {
            return {
                // id_page: null,
                // modal: false,
                outOfOrderComment: null,
                date_out: new Date().toISOString().substr(0, 10),
                menu: false,
                name_button: 'Списать',
                progress: 0,
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
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        methods:{

            async makeAll() {
                this.loading = true;

                for (let i = 0; i < this.choosedEquimpment.length; i++) {
                    const itemId = this.choosedEquimpment[i].id

                    this.makeOutOfOrder(itemId)
                    this.progress = 100 / this.choosedEquimpment.length  * (i + 1);

                }
                this.loading = false;
                if (!this.error_alert) {
                    this.succ_text = 'Списания успешно проведены'
                    this.succ_alert = true
                }



            },
            async makeOutOfOrder(equipmentId) {
                this.HTTP().post(`/equipment/out-of-order`, {
                    equipment_id: equipmentId,
                    state: true,
                    comment: this.outOfOrderComment
                })
                    .then((response) => {

                    })
                    .catch((error) => {
                        this.succ_alert = false
                        this.error_alert = true
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
