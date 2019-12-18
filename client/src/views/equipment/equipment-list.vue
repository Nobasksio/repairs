<template >
    <div >
        <v-row >
            <v-col cols="2" >
                <v-autocomplete
                        label="Подразделение"
                        :items="departments"
                        v-model="departmentFilter"
                        chips
                        small-chips
                        multiple
                        item-text="name"
                        @change="setDepartmentFilter"
                        item-value="id"
                        outlined
                ></v-autocomplete >
            </v-col >
            <v-col cols="2" >
                <v-autocomplete
                        label="группа"
                        :items="group_eq"
                        v-model="groupFilter"
                        @change="setGroupFilter"
                        chips
                        small-chips
                        multiple
                        item-text="name"
                        item-value="id"
                        outlined
                ></v-autocomplete >
            </v-col >
            <v-col cols="2" class="pb-0" >

                <v-autocomplete
                        v-model="nameFilter"
                        label="Название"
                        placeholder="например Чайник"
                        :items="filter_equipments"
                        @change="setNameFilter"
                        item-text="name"
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
            <v-col cols="3" >
                <v-autocomplete
                        v-model="numberUniqFilter"
                        label="внутренний инвентарный номер"
                        placeholder="например 12345"
                        :items="filter_equipments"
                        @change="setNumberUniqFilter"
                        item-text="in_number_uniq"
                        item-value="id"
                        outlined
                        class="mr-2 mb-0"
                ></v-autocomplete >
            </v-col >
            <v-col >
                <div class="caption text-center" >
                    сумма оборудования <br >
                    <span class="font-weight-black" >{{ summ_filtred }} руб</span >
                </div >
            </v-col >
            <v-col >
                <v-btn color="primary" class="mt-1"

                       large @click="clear" >очистить
                </v-btn >
            </v-col >
        </v-row >

        <v-data-table
                :headers="headers"
                :items="filter_equipments"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                :options="{itemsPerPage:50}"
                class="elevation-1 pb-10"
                v-model="selected"
                show-select
                @page-count="pageCount = $event"
        >
            <template v-slot:item.equipment_id="{ item }" >
                {{ (getEquipment(item.equipment_id)).name }}
            </template >
            <template v-slot:item.department_id="{ item }" >
                {{ (getDepartment(item.department_id)).name }}
            </template >

            <template v-slot:item.type_eq_id="{ item }" >
                {{ (getGroup(item.type_eq_id)).name }}
            </template >
            <template v-slot:item.date_buy="{ item }" >
                {{ date_format(item.date_buy)}}
            </template >
            <template v-slot:item.warranty="{ item }" >
                {{ date_format(item.warranty)}}
            </template >
            <template v-slot:item.isWarranty="{ item }" >
                {{ item.isWarranty ? 'да': 'Нет'}}
            </template >
            <template v-slot:item.action="{ item }" >

                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    edit
                </v-icon >

            </template >
        </v-data-table >
        <v-footer v-show="selected.length > 0 "
                  :fixed="true"
                  :padless="true" >
            <v-card
                    flat
                    tile
                    width="100%"
                    class="blue lighten-2 text-right pb-2"
            >
                <v-card-text ><span class="white--text" >
                    Вы выбрали <b >{{ selected.length }} единиц</b > оборудования</span >
                    <v-btn
                            @click="go_to_print()"
                            class="mx-4"

                    >
                        Напечатать штрихкоды
                    </v-btn >
                </v-card-text >

            </v-card >

        </v-footer >
    </div >
</template >

<script >
    import {mapState, mapMutations, mapActions} from 'vuex';




    const axios = require('axios');
    import HTTTP from '../../http';

    export default {
        metaInfo: {
            title: 'Список оборудования',
        },
        data() {
            return {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                menu: false,
                menu2: false,
                departments: [],
                group_eq: [],
                filter: {
                    department: [],
                    name: null,
                    number_uniq: null,
                    group: []
                },
                selected: [],
                headers: [
                    {
                        text: 'Название',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    {text: 'Подразделение', value: 'department_id'},
                    {text: 'Группа', value: 'type_eq_id'},
                    {text: 'Номер', value: 'out_number'},
                    {text: 'Гарантия', value: 'isWarranty'},
                    {text: 'Цена', value: 'price'},
                    {text: 'Дата Покупки', value: 'date_buy'},
                    // { text: 'В ремонте', value: 'iron' },
                    {text: '', value: 'action', sortable: false},
                ],
                equipments: [],
            }
        },
        mounted() {
            HTTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.group_eq.splice(0, this.group_eq.length, ...response.data.type);
                })
                .catch((error) => {
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
        computed: {
            ...mapState('filter', ['departmentFilter', 'groupFilter', 'nameFilter', 'numberUniqFilter']),
            filter_equipments() {
                let filtred;

                if (this.departmentFilter.length > 0) {
                    filtred = this.equipments.filter((item) => {
                        let step = false;
                        for (let i = 0; i < this.departmentFilter.length; i++) {
                            if (item.department_id == this.departmentFilter[i]) {
                                step = true
                                break;
                            }
                        }
                        return step

                    })
                } else {
                    filtred = this.equipments
                }

                if (this.groupFilter.length > 0) {
                    filtred = filtred.filter((item) => {
                        let step = false;
                        for (let i = 0; i < this.groupFilter.length; i++) {
                            if (item.type_eq_id == this.groupFilter[i]) {
                                step = true
                                break;
                            }
                        }
                        return step

                    })
                }

                if (this.nameFilter != null) {
                    filtred = filtred.filter((item) => {
                        return item.id == this.nameFilter
                    })
                }

                if (this.numberUniqFilter != null) {
                    filtred = filtred.filter((item) => {
                        return item.id == this.numberUniqFilter
                    })
                }


                return filtred
            },
            summ_filtred() {
                let summ = 0

                this.filter_equipments.forEach((item, i, arr) => {
                    summ = summ + item.price
                })

                return summ
            }
        },
        methods: {
            ...mapMutations('filter', [
                'setDepartmentFilter', 'setGroupFilter', 'setNameFilter', 'setNumberUniqFilter'
            ]),
            ...mapActions('filter', ['clear']),
            getEquipment(equipment_id) {
                let our_equipment = this.equipment.filter((item) => {
                    return item.id == equipment_id
                })
                if (our_equipment.length == 0) {
                    our_equipment = [{name: ''}]
                }
                return our_equipment[0]
            },
            getGroup(type_id) {
                let our_group = this.group_eq.filter((item) => {
                    return item.id == type_id
                })
                if (our_group.length == 0) {
                    our_group = [{name: ''}]
                }
                return our_group[0]
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
            editItem(item) {
                this.$router.push('/equipment/' + item.id)
            },
            deleteItem(item) {
                const index = this.equipments.indexOf(item)
                confirm('Вы на самом деле хотите удалить это оборудование?') && this.equipments.splice(index, 1)
            },
            date_format(date) {
                let new_date = ''
                if (date != null) {
                    new_date = date.substr(0, 10)
                } else {
                    new_date = ''
                }
                return new_date
            },
            go_to_print() {
                this.$router.push({name: 'barcode', params: {equipments: this.selected}})
            },
            clean() {
                this.filter.department = []
                this.filter.group = []
                this.filter.number_uniq = null
                this.filter.name = null

            }
        }
    }
</script >
