<template >
    <div
            class="fill-height"
            fluid
    >
        <v-form v-model="valid" >

            <v-container class="fill-height" fluid >
                <v-container >
                    <h1 class="display-1" >Инвентаризация </h1 >
                    <div class="subtitle-1" >{{inventory.department.name}} ({{ inventory.date_plan.substr(0,10) }})
                    </div >
                    <v-alert prominent type="warning" v-if="inventory.isClose" >
                        <v-row align="center" >
                            <v-col cols="auto" >
                                Инвентаризация закрыта
                                Чтобы внести изменения разблокируйте её
                            </v-col >
                            <v-col class="shrink" >


                                <v-btn

                                        @click="openInventory"
                                >Разблокировать
                                </v-btn >
                            </v-col >
                        </v-row >
                    </v-alert >
                    <h2 class="title" >Оборудование на момент проведения: </h2 >
                </v-container >


                <v-list class="w-100" >
                    <v-list-group :key="`groupClass${category}`" v-for="(item_category,category) in groupSet" >
                        <template v-slot:activator >
                            <v-list-item-title class="font-weight-bold" >{{category}} ({{ countCategory(item_category)
                                }} / {{countCategoryCheck(item_category)}} )
                            </v-list-item-title >
                        </template >

                        <v-list-group
                                no-action
                                sub-group
                                v-if="name_arr.groups.length>1"
                                :key="`groupName${index}`"
                                v-for="(name_arr,index) in item_category"
                        >
                            <template v-slot:activator >

                                <v-list-item-title >{{name_arr.name}} {{name_arr.groups.length}} шт
                                </v-list-item-title >


                            </template >


                            <v-list-item
                                    v-if="name_arr.groups.length>1"
                            >
                                <template >
                                    <v-list-item-content >
                                        <v-list-item-title
                                        > все
                                        </v-list-item-title >
                                    </v-list-item-content >
                                    <v-list-item-action @click="toogle_group(name_arr)" >
                                        <v-checkbox

                                                :readonly="inventory.isClose"
                                                v-model="name_arr.status"
                                                color="primary"
                                        ></v-checkbox >
                                    </v-list-item-action >
                                </template >
                            </v-list-item >
                            <v-list-item
                                    :key="`groupName${item.id}`"
                                    v-for="item in name_arr.groups"
                                    :class="{'grey lighten-3' : item.status }"
                            >

                                <template >
                                    <v-list-item-content >
                                        <v-list-item-title
                                                class="pl-2" > {{ item.equipment.name }} <span
                                                class="grey--text text-12" >{{ item.equipment.in_number_uniq}}</span >
                                        </v-list-item-title >
                                    </v-list-item-content >
                                    <v-list-item-action >
                                        <v-checkbox
                                                :readonly="inventory.isClose"
                                                :input-value="item.status"
                                                @change="updateItemStatus(item)"
                                                color="primary"
                                        ></v-checkbox >
                                    </v-list-item-action >
                                </template >
                            </v-list-item >
                        </v-list-group >
                        <template v-else >
                            <v-list-item
                                    :key="`groupName${item.id}`"
                                    v-for="item in name_arr.groups"
                                    :class="{'grey lighten-3' : item.status }"
                            >
                                <template >
                                    <v-list-item-content >
                                        <v-list-item-title
                                                class="pl-2"
                                        > {{ item.equipment.name }} <span
                                                class="grey--text text-12" >{{ item.equipment.in_number_uniq}}</span >
                                        </v-list-item-title >
                                    </v-list-item-content >
                                    <v-list-item-action >
                                        <v-checkbox
                                                :readonly="inventory.isClose"
                                                :input-value="item.status"
                                                color="primary"
                                                @change="updateItemStatus(item)"
                                        ></v-checkbox >
                                    </v-list-item-action >
                                </template >
                            </v-list-item >
                        </template >


                    </v-list-group >
                </v-list >

                <v-container >
                    <h2 class="title pb-3" >Излишки: </h2 >
                    <v-card
                            class="w-100"

                            tile
                    >
                        <v-list-item :key="`added${item.id}`" v-for="item in added_equipments" >
                            <v-list-item-content >
                                <v-list-item-title >{{ item.equipment.name }}</v-list-item-title >
                            </v-list-item-content >
                        </v-list-item >

                    </v-card >

                </v-container >

                <div class="py-5" >
                    <v-btn
                            @click="dialog_end = !dialog_end"
                            class="mx-4"

                    >
                        Завершить
                    </v-btn >
                    <v-btn
                            @click="dialog_add = !dialog_add"
                            class="mx-4"
                    >
                        Добавить излишек
                    </v-btn >
                    <deleteButton
                            entity_name_ru="Инвентаризация"
                            entity_name_eng="inventory"
                            go_to="inventory"
                            :want_delete_id="inventory.id"
                    ></deleteButton >
                    <v-btn v-if="inventory.isClose"
                           @click="downLoad()"
                    >
                        Скачать
                    </v-btn >
                </div >

                <v-footer
                        :fixed="true"
                        app
                        :inset="true"
                        :padless="true" >
                    <v-card
                            flat
                            tile
                            width="100%"
                            class="blue lighten-2 pb-2"
                    >
                        <v-card-text >
                            <v-row >
                                <v-col >

                                    <v-autocomplete
                                            v-model="nameFilter"
                                            label="Название"
                                            placeholder="например Чайник"
                                            :items="filter_equipments"
                                            item-text="equipment.name"
                                            item-value="equipment.id"
                                            outlined
                                            solo
                                            class="mr-2 mb-n7"
                                    >
                                        <template v-slot:item="data" >
                                            <template >
                                                <v-list-item-content >
                                                    <v-list-item-title
                                                            v-html="data.item.equipment.name" ></v-list-item-title >

                                                </v-list-item-content >
                                            </template >
                                        </template >
                                    </v-autocomplete >
                                </v-col >
                                <v-col >
                                    <v-autocomplete
                                            v-model="numberUniqFilter"
                                            label="внутренний инвентарный номер"
                                            placeholder="например 12345"
                                            :items="filter_equipments"
                                            item-text="equipment.in_number_uniq"
                                            item-value="equipment.id"
                                            outlined
                                            solo
                                            class="mr-2 mb-n10"
                                    >
                                        <template v-slot:item="data" >
                                            <template >
                                                <v-list-item-content >
                                                    <v-list-item-title
                                                            v-html="data.item.equipment.in_number_uniq" ></v-list-item-title >

                                                </v-list-item-content >
                                            </template >
                                        </template >

                                    </v-autocomplete >
                                </v-col >
                                <v-col >
                                    <v-btn
                                            @click="clean"
                                            class="mx-4"
                                    >
                                        Очистить
                                    </v-btn >
                                </v-col >
                            </v-row >
                        </v-card-text >

                    </v-card >

                </v-footer >

            </v-container >
        </v-form >

        <v-dialog v-model="dialog_end" fullscreen hide-overlay transition="dialog-bottom-transition" >

            <v-card >
                <v-toolbar dark color="red" >
                    <v-btn icon dark @click="dialog_end = false" >
                        <v-icon >mdi-close</v-icon >
                    </v-btn >
                    <v-toolbar-title >Завершить инвентаризацию?</v-toolbar-title >
                    <v-spacer ></v-spacer >

                </v-toolbar >
                <v-list two-line subheader >
                    <v-subheader >Итоги</v-subheader >
                    <v-list-item >
                        <v-list-item-content >
                            <v-list-item-title >{{ planPcs }} ед.</v-list-item-title >
                            <v-list-item-subtitle >Всего единиц числилось до инвентаризации</v-list-item-subtitle >
                        </v-list-item-content >
                    </v-list-item >
                    <v-list-item >
                        <v-list-item-content >
                            <v-list-item-title >{{ checedPcs }} ед.</v-list-item-title >
                            <v-list-item-subtitle >В наличии</v-list-item-subtitle >
                        </v-list-item-content >
                    </v-list-item >
                    <v-list-item >
                        <v-list-item-content >
                            <v-list-item-title >{{ planPcs - checedPcs }} ед.</v-list-item-title >
                            <v-list-item-subtitle >Не найдено</v-list-item-subtitle >
                        </v-list-item-content >
                    </v-list-item >
                    <v-list-item >
                        <v-list-item-content >
                            <v-list-item-title >{{ addedPcs }} ед.</v-list-item-title >
                            <v-list-item-subtitle >Зафиксировано излишек</v-list-item-subtitle >
                        </v-list-item-content >
                    </v-list-item >
                </v-list >
                <v-divider ></v-divider >
                <v-list two-line subheader >

                    <v-list-item >
                        <v-list-item-content >
                            <v-row >
                                <v-col cols="6" >
                                    <v-subheader class="pl-0" >Чтобы завершить инвентаризацию напишите слов «конец» в
                                        поле ниже
                                    </v-subheader >

                                    <v-text-field
                                            label=""
                                            class="mb-n10"
                                            outlined
                                            v-model="end_text"
                                    ></v-text-field >
                                </v-col >
                            </v-row >

                        </v-list-item-content >
                    </v-list-item >
                </v-list >
                <v-card-actions >

                    <v-row >
                        <v-col cols="12" class="pl-6" v-if="showSuccessClosed" >
                            <v-alert type="success" >
                                Инвентарзация успешно закрыта
                            </v-alert >
                        </v-col >
                        <v-col cols="4" class="pl-6" >
                            <v-btn
                                    color="success"
                                    @click="closeInventory"
                                    :disabled="endCheck" >Завершить
                            </v-btn >
                        </v-col >

                    </v-row >
                </v-card-actions >

            </v-card >

        </v-dialog >
        <v-dialog
                v-model="showSyncDialog"
                width="600"
        >
            <v-card >
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    Синхронизация данных
                </v-card-title >

                <v-card-text class="pt-5" >
                    <p >У вас сохранена локальная копия данных данной инвентаризации.</p >
                    <p > Поселдний обмен с сервером был 15 минут назад.</p >
                    Хотите выгрузить локальные данные на сервер? (на сервере сохранится то что у вас в планшете)
                    <p >Или хотите скачать данные с сервера? (на планшет загрузятся данные с сервера)</p >
                </v-card-text >

                <v-divider ></v-divider >

                <v-card-actions >
                    <v-row >
                        <v-col >
                            <v-btn
                                    color="success"
                                    @click="uploadInventoryData()" >
                                Загрузить
                                <v-icon >mdi-upload</v-icon >
                            </v-btn >
                        </v-col >
                        <v-col class="text-center" >
                            <v-btn
                                    color=""
                                    @click="showSyncDialog = false" >
                                Решить позже
                            </v-btn >
                        </v-col >
                        <v-col class="text-right" >

                            <v-btn
                                    color="error"
                                    @click="downloadInvData()" >
                                Скачать
                                <v-icon >mdi-download</v-icon >
                            </v-btn >
                        </v-col >
                    </v-row >


                </v-card-actions >
            </v-card >
        </v-dialog >
        <v-dialog v-model="dialog_add" fullscreen hide-overlay transition="dialog-bottom-transition" >

            <v-card >
                <v-toolbar dark color="green" >
                    <v-btn icon dark @click="dialog_add = false" >
                        <v-icon >mdi-close</v-icon >
                    </v-btn >
                    <v-toolbar-title >Переместить</v-toolbar-title >
                    <v-spacer ></v-spacer >

                </v-toolbar >
                <v-card-text >
                    <inventory-transfer
                            :department_to="inventory.department_id"
                            @addInventoryItem="addInventoryItem"
                            :inventory='inventory' ></inventory-transfer >
                </v-card-text >

                <v-card-actions >
                    <v-row >
                        <v-col cols="4" class="pl-6" >
                            <v-btn
                                    color="success"
                                    @click="dialog_add = !dialog_add"
                            >Завершить
                            </v-btn >
                        </v-col >
                    </v-row >
                </v-card-actions >
            </v-card >

        </v-dialog >
    </div >
</template >

<script >
    import inventoryTransfer from '../transfer/inventory-transfer'
    import baseGetters from '../../mixins/base-getters'
    import deleteButton from '../delete-button'
    import {mapState, mapMutations, mapActions} from 'vuex';
    import {json2excel, excel2json} from 'js2excel';

    export default {
        name: "inventory",
        components: {
            inventoryTransfer,
            deleteButton
        },
        mixins: [baseGetters],
        mounted() {
            if (this.inventory == null || this.isSync) {
                console.log('may')
                this.getINventory(this.$route.params.id);
            } else if (!this.isSync) {
                this.showSyncDialog = true;
            }


            this.HTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                    this.group_eq.splice(0, this.group_eq.length, ...response.data.type);
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        data() {
            return {

                showSyncDialog: false,
                myau: false,
                valid: false,
                dialog_end: false,
                dialog_add: false,
                end_text: '',
                numberUniqFilter: null,
                nameFilter: null,
                showSuccessClosed: false,
            }
        },
        methods: {
            ...mapActions('inventory', ['getINventory', 'uploadInventory', 'updateItemStatus', 'updateInventoryNameGroupStatus']),
            ...mapMutations('inventory', ['setInventoryClose']),
            downLoad() {

                const list = this.groupSet;
                const listKeys = Object.keys(list)
                console.log(list);
                const exportList = [];
                listKeys.forEach((item) => {
                    for (let i = 0; i < list[item].length; i += 1) {

                        const thereIsEquipment = list[item][i].groups.filter((itemEq)=>{
                            return itemEq.status === 1 || itemEq.status === true;
                        })

                        const deltaItem = list[item][i].groups.length - thereIsEquipment.length;
                        const price = list[item][i].groups[0].equipment.price;
                        const row = {
                            'Название': list[item][i].name,
                            'Книжное кол-во шт': list[item][i].groups.length,
                            'Фактическое кол-во шт': thereIsEquipment.length,
                            'Категория': item,
                            'Цена': price,
                            'Разница в колличестве шт': deltaItem,
                            'Разница в сумме р': deltaItem * price,
                            'Комментарий': ''
                        };

                        exportList.push(row);
                    }
                });

                try {
                    json2excel({
                        data: exportList,
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
            toogle_group(name_arr) {
                this.updateInventoryNameGroupStatus(name_arr)
            },
            downloadInvData() {
                this.getINventory(this.$route.params.id);
            },
            uploadInventoryData() {
                this.uploadInventory(this.$route.params.id);
            },
            //перенести в общий компонент
            clean() {
                this.numberUniqFilter = null
                this.nameFilter = null

            },
            get_status(equipment) {
                let equipment_output = this.inventory.InventoryItems.filter((item) => {
                    return item.equipment_id == equipment.id
                })

                return equipment_output[0]
            },
            addInventoryItem(data) {
                this.inventory.InventoryItems.push(data.inventory_item)
                this.equipments.push(data.inventory_item.equipment)
            },
            groupName(equipments) {
                let group = {}, sort_group_alp = [], sort_len = [];


                equipments.forEach((item) => {
                    if (group[item.equipment.name] !== undefined) {
                        group[item.equipment.name]['groups'].push(item)
                    } else {
                        group[item.equipment.name] = {
                            groups: [],
                            status: false,
                            name: item.equipment.name
                        }
                        group[item.equipment.name]['groups'].push(item)
                    }
                })


                for (let index in group) {

                    sort_len.push(group[index])

                    //сортировка чтобы все где больше 1 штуки ушло вниз
                    // отключено 26.07.2020
                    // if (group[index].groups.length == 1) {
                    //     sort_len.unshift(group[index])
                    // } else {
                    //     sort_len.push(group[index])
                    // }

                }

                //сортируем второй уровень

                sort_len = sort_len.sort((a, b) => {
                    if (a.name > b.name) return 1
                    return 0
                })

                //сортируем третий уровень
                for (let i; i < sort_len.length; i++) {
                    sort_len[i].groups = sort_len[i].groups.sort((a, b) => {
                        if (a.equipment.name > b.equipment.name) return 1
                        return 0
                    })
                }


                return sort_len
            },
            countCategory(itemGroup) {
                let count = 0;

                itemGroup.forEach((item) => {
                    count += item.groups.length
                })

                return count

            },
            countCategoryCheck(itemGroup) {
                let count = 0;

                itemGroup.forEach((item) => {


                    item.groups.forEach((itemEquipment) => {
                        if (itemEquipment.status == true) count++
                    })
                })

                return count
            },
            closeInventory() {
                this.setInventoryClose(true)
                this.HTTP().put('/inventory/' + this.$route.params.id, {
                    inventory: this.inventory
                }).then(({data}) => {
                    this.showSuccessClosed = true


                })
            },

            openInventory() {
                this.setInventoryClose(false)
                this.HTTP().put('/inventory/' + this.$route.params.id, {
                    inventory: this.inventory
                }).then(({data}) => {


                })
            },
            // функция для сортировки ключей объекта
            customSort(obj, lastkey) {
                let res = {};
                Object.keys(obj).sort(function (a, b) {
                    return a == lastkey ? true : b == lastkey ? false : a > b;
                }).forEach(function (key) {
                    res[key] = obj[key];
                });
                return res;
            }
        },
        computed: {
            ...mapState('inventory', ['inventory', 'isSync', 'dateSync', 'equipments']),
            groupSet() {
                let groups = {}

                this.filter_equipments.forEach((item) => {
                    let {name} = this.getGroup(item.equipment.type_eq_id)
                    if (groups[name] !== undefined) {
                        groups[name].push(item)
                    } else {
                        groups[name] = []
                        groups[name].push(item)
                    }

                })
                for (let index in groups) {

                    groups[index] = this.groupName(groups[index])
                }


                //сортируем третий уровень
                groups = this.customSort(groups, '');


                return groups
            },
            endCheck() {
                return this.end_text.toLowerCase() != 'конец'
            },
            filter_equipments() {
                let filtred = this.inventory.InventoryItems;

                filtred = filtred.filter(item => item.cause != 2)

                if (this.nameFilter !== null) {
                    filtred = filtred.filter((item) => {
                        return item.equipment.id == this.nameFilter
                    })

                }

                if (this.numberUniqFilter !== null) {
                    filtred = filtred.filter((item) => {
                        return item.equipment.id == this.numberUniqFilter
                    })

                }
                filtred = filtred.sort((a, b) => {
                    if (a.equipment.name > b.equipment.name) return 1
                    return 0
                });


                return filtred
            },
            added_equipments() {
                let filtred = this.inventory.InventoryItems
                    .filter(item => item.cause == 2)


                return filtred
            },
            planPcs() {
                return this.inventory.InventoryItems.filter((item) => {
                    return item.cause == 1
                }).length

            },
            addedPcs() {
                return this.inventory.InventoryItems.filter((item) => {
                    return item.cause == 2
                }).length

            },
            checedPcs() {
                return this.inventory.InventoryItems.filter((item) => {
                    return (item.status == true && item.cause == 1)
                }).length

            },
        }
    }
</script >

<style scoped >
    .w-100 {
        width: 100%;
    }

    .text-12 {
        font-size: 12px;
    }
</style >
