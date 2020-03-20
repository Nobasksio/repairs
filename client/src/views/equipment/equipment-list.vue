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
                    <span class="font-weight-black" >{{ new Intl.NumberFormat('ru-RU').format(summ_filtred)  }} руб</span >
                </div >
            </v-col >
            <v-col >
                <v-btn small color="primary" class="mt-1"

                       @click="clear" >очистить
                </v-btn >
                <v-btn small color="primary" class="mt-1"

                       @click="isGroupName = !isGroupName" >
                    {{isGroupName ? 'разгр.' : 'групп.'}}
                </v-btn >
            </v-col >
            <v-col >
                <v-btn small color="primary" class="mt-1"

                       @click="downXls()" >Скачать
                </v-btn >

            </v-col >
        </v-row >
        <v-data-table
                :headers="headersGroup"
                :items="groupName"
                class="elevation-1 pb-10"
                item-key="name"
                show-expand
                disable-pagination
                @page-count="pageCount = $event"
                v-if='isGroupName'
        >
            <template v-slot:item.name="{ item }" >
                {{ item.name }}
            </template >
            <template v-slot:item.department_id="{ item }" >
                {{ (getDepartment(item.department_id)).name }}
            </template >
            <template v-slot:item.count="{ item }" >
                {{ item.items.length }}
            </template >
            <template v-slot:expanded-item="{ item }" >
                <td :colspan="headersGroup.length +1" class="px-0" >
                    <v-data-table
                            :headers="headers"
                            :items="item.items"
                            :page.sync="page"
                            dense
                            class="elevation-1"
                            v-model="selected"
                            show-select
                            hide-default-footer
                            :disable-pagination="false"
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
                </td >
            </template >
        </v-data-table >
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
                v-if='!isGroupName'
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
                {{ date_format(item.date_buy) }}
            </template >
            <template v-slot:item.warranty="{ item }" >
                {{ date_format(item.warranty) }}
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
        <action-eq-row
                :selected="selected"
        >
        </action-eq-row >
    </div >
</template >

<script >
    import {mapState, mapMutations, mapActions} from 'vuex';
    import {json2excel, excel2json} from 'js2excel';


    import actionEqRow from '../../components/action-equipment-row';

    const axios = require('axios');
    import HTTTP from '../../http';

    export default {
        metaInfo: {
            title: 'Список оборудования',
        },
        components: {
            actionEqRow
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
                isGroupName: false,

                expanded: [],
                filter: {
                    department: [],
                    name: null,
                    number_uniq: null,
                    group: []
                },
                selected2s: [],
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
                headersGroup: [
                    {
                        text: 'Название',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    {
                        text: 'подразделение',
                        value: 'department_id'
                    },
                    {
                        text: 'количество',
                        value: 'count'
                    },
                    {text: '', value: 'data-table-expand'},

                ],
                equipments: [],
                stockData: [
                    {
                        Symbol: "Арутр",
                        Company: "Молодец",
                        Price: 132.54
                    },
                    {
                        Symbol: "INTC",
                        Company: "Intel Corporation",
                        Price: 33.45
                    },
                    {
                        Symbol: "GOOG",
                        Company: "Google Inc",
                        Price: 554.52
                    },
                ]
            }
        },
        mounted() {
            this.HTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.group_eq.splice(0, this.group_eq.length, ...response.data.type);
                })
                .catch((error) => {
                    console.log(error);
                })
            this.HTTP().get('/equipments')
                .then((response) => {
                    this.equipments.splice(0, this.equipments.length, ...response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })

        },
        computed: {
            ...mapState('filter', ['departmentFilter', 'groupFilter', 'nameFilter', 'numberUniqFilter']),
            ...mapState('lists', ['choosedEquimpment']),
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
                let summ = 0;

                this.filter_equipments.forEach((item, i, arr) => {
                    summ = summ + item.price
                })

                return summ
            },
            groupName() {
                let group = {}, arrayGroupName = [], equipments = this.filter_equipments;


                for (let i = 0; i < equipments.length; i++) {
                    let hash = `${equipments[i].name}${equipments[i].department_id}`
                    if (group[hash] !== undefined) {
                        group[hash].push(equipments[i])
                    } else {
                        group[hash] = []
                        group[hash].push(equipments[i])
                    }
                }

                let i = 0

                for (let index in group) {

                    arrayGroupName.push({
                        name: group[index][0].name,
                        items: group[index],
                        value: i,
                        department_id: group[index][0].department_id
                    })
                    i++
                }

                console.log(arrayGroupName)
                return arrayGroupName
            },
        },
        methods: {
            ...mapMutations('filter', [
                'setDepartmentFilter', 'setGroupFilter', 'setNameFilter', 'setNumberUniqFilter'
            ]),
            ...mapMutations('lists', [
                'setChoosedEquipment'
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
            clean() {
                this.filter.department = []
                this.filter.group = []
                this.filter.number_uniq = null
                this.filter.name = null

            },
            downXls() {
                // this will be export a excel and the file's name is user-info-data.xlsx
// the default file's name is excel.xlsx
                try {
                    json2excel({
                        data: this.filter_equipments,
                        name: 'user-info-data',
                        formateDate: 'yyyy/mm/dd'
                    });
                } catch (e) {
                    console.error('export error');
                }

// for webpack 3: dynamic import
                import(/* webpackChunkName: "js2excel" */ 'js2excel').then(({json2excel}) => {
                    json2excel({
                        data,
                        name: 'test',
                        formateDate: 'dd/mm/yyyy'
                    });
                }).catch((e) => {

                });

            },
        },
        watch: {
            selected: function (newValue, OldValue) {
                this.setChoosedEquipment(newValue)
            }
        }
    }
</script >
<style scoped >
    .w-100 {
        min-width: 100%;
    }
</style >
