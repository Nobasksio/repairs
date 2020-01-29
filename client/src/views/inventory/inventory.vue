<template >
    <div
            class="fill-height"
            fluid
    >
        <v-form v-model="valid" >
            <h1 class="display-1" >Инвентаризация </h1 >
            <div class="subtitle-1" >Антрекот КМ (21.10.2020)</div >
            <v-container
                    class="fill-height"
                    fluid
            >
                <v-list >
                    <v-list-group
                            value="true"
                    >
                        <template v-slot:activator >
                            <v-list-item-title >Мебель</v-list-item-title >
                        </template >
                        <v-list-group
                                no-action
                                sub-group
                                value="true"
                        >
                            <template v-slot:activator >

                                <v-list-item-content >
                                    <v-list-item-title  >Холодильник Аристон 20 шт
                                    </v-list-item-title >
                                </v-list-item-content >
                                <v-list-item-action >
                                    <v-checkbox
                                            v-model="active"
                                            color="primary"

                                    ></v-checkbox >
                                </v-list-item-action >
                            </template >

                            <v-list-item
                            >
                                <template >
                                    <v-list-item-content >
                                        <v-list-item-title
                                        > Тест </v-list-item-title >
                                    </v-list-item-content >
                                    <v-list-item-action >
                                        <v-checkbox
                                                v-model="active"
                                                color="primary"

                                        ></v-checkbox >
                                    </v-list-item-action >
                                </template >
                            </v-list-item >

                        </v-list-group >


                    </v-list-group >
                </v-list >

            </v-container >
        </v-form >
    </div >
</template >

<script >
    export default {
        name: "inventory",
        data() {
            return {
                active: false,
                valid: false,
            }
        },
        methods: {
            toggle() {

            }
        }
    }
</script >

<style scoped >

</style >