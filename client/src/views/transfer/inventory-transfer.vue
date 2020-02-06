<template >
    <div >

        <v-form v-model="valid" >

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0" >

                        <v-autocomplete
                                v-model="search_name"
                                label="Название"
                                placeholder="например Чайник"
                                :items="filter_equipments"
                                item-text="name"
                                item-value="id"
                                outlined
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
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
                    <v-col cols="4" >
                        <v-autocomplete
                                v-model="search_in_number_uniq"
                                label="Внутренний инвентарный номер"
                                placeholder="например 12345"
                                :items="filter_equipments"
                                item-text="in_number_uniq"
                                item-value="id"
                                :rules="[v => !!v || 'Подразделение не может быть пустым']"
                                outlined
                                class="mr-2 mb-0"
                        ></v-autocomplete >
                    </v-col >
                    <!--<v-col class="mt-2" >-->
                    <!--<v-btn color="primary" @click="" >найти</v-btn >-->
                    <!--</v-col >-->
                </v-row >
                <v-row >

                    <v-col cols="4" >
                        <v-autocomplete
                                label="Перемещаем с"
                                :items="departments"
                                v-model="search_from_dep_id"
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
                                readonly
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
                               large @click="proxyCreateTransfer()" >{{name_button}}
                        </v-btn >
                    </v-col >
                </v-row >
            </v-container >
        </v-form >
    </div >
</template >

<script >
    import baseTransfer from './base-transfer'

    export default {
        name: "inventory-transfer",
        props: {
            department_to: Number,
            inventory: Object,
        },
        beforeMount() {
            this.transfer.to_dep_id = this.department_to
        },
        mixins: [baseTransfer],
        methods: {
            proxyCreateTransfer() {
                let department = this.getDepartment(this.department_to)
                this.transfer.description = `Инвентаризация от ${this.inventory.created_at} на подразделении ${department.name} \n ${this.transfer.description}`

                this.create_transfer()
                this.addEquipmentToInventory()
            },
            addEquipmentToInventory() {
                this.HTTP().post('/addInventoryItem',
                    {
                        intentoryItem: {
                            inventory_id: this.inventory.id,
                            equipment_id: this.transfer.equipment.id,
                            status: true,
                            cause: 2,
                            isDelete: false
                        }
                    }).then(({data}) => {
                    this.$emit('addInventoryItem',
                        {
                            inventory_item: data.inventory_item,
                            equipment: data.equipment
                        }
                    )

                }).catch((error) => {
                    this.succ_alert = false
                    this.error_alert = true
                    console.log(error);
                });

            }
        },
        watch: {}
    }
</script >

<style scoped >

</style >