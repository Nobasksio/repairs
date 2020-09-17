<template >
    <v-footer v-show="selected.length > 0 "
              :fixed="true"
              :inset="true"
              app
              :padless="true" >
        <v-card
                flat
                tile
                width="100%"
                class="blue lighten-2 text-right pb-0"
        >
            <v-card-text >
                <v-row >

                    <v-col class="pb-0" >
                        <v-select
                                :items="actions"
                                solo
                                item-value="action"
                                class="mb-0"
                                v-model="action"
                                label="Standard"
                        ></v-select >
                    </v-col >
                    <v-col class="pb-0"  >

                        <span class="white--text" >
                            Вы выбрали <b >{{ selected.length }} единиц</b > оборудования
                        </span >
                        <v-btn
                                v-if="action == 'print'"
                                @click="go_to_print()"
                                class="mx-4"
                        >
                            Напечатать штрихкоды
                        </v-btn >
                        <v-btn
                                v-if="action == 'transfer'"
                                @click="go_to_transfer()"
                                class="mx-4"
                        >
                            Переместить
                        </v-btn >
                        <v-btn
                                v-if="action == 'delete'"
                                @click="go_to_delete()"
                                class="mx-4"
                        >
                            Удалить
                        </v-btn >
                        <v-btn
                                v-if="action === 'outOfOrder'"
                                @click="goToOutOfOrder()"
                                class="mx-4"
                        >
                            Списать
                        </v-btn >
                    </v-col >
                </v-row >
            </v-card-text >

        </v-card >

    </v-footer >
</template >

<script >
    import {mapState, mapMutations, mapActions} from 'vuex';
    export default {
        name: "action-equipment-row",
        props: ['selected'],
        data() {
            return {
                action: 'print',
                actions: [
                    {
                        text: 'Переместить',
                        action: 'transfer'
                    },
                    {
                        text: 'Напечатать штрихкод',
                        action: 'print'
                    },
                    {
                        text: 'Списать',
                        action: 'outOfOrder'
                    },
                    // {
                    //     text: 'Удалить',
                    //     action: 'delete'
                    // },
                ]
            }
        },
        methods:{
            ...mapMutations('lists', [
                'setChoosedEquipment'
            ]),
            go_to_print() {
                this.$router.push({name: 'barcode', params: {equipments: this.selected}})
            },
            go_to_transfer() {
                this.$router.push({name: 'packetTransfer', params: {equipments: this.selected}})
            },
            go_to_delete() {
                this.$router.push({name: 'packetDelete', params: {equipments: this.selected}})
            },
            goToOutOfOrder() {
                this.$router.push({name: 'listOutOfOrder', params: {equipments: this.selected}})
            },

        },
        ...mapState('lists', ['choosedEquimpment']),

    }
</script >

<style scoped >

</style >
