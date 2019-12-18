<template >
    <div class="float-right" >
        <v-tooltip left  :disabled="!check_t">
            <template v-slot:activator="{ on }" >
                <v-btn color="error" class="m-2 mx-5 float-right"
                       :loading="loading"
                       v-on="on"
                       @click="wantDelete(want_delete_id)"
                       large >удалить
                </v-btn >
            </template >
            <span >{{ check_text }}</span >
        </v-tooltip >
        <v-dialog
                v-model="dialog"
                max-width="30%"
        >
            <v-card >
                <v-card-title class="headline" >Вы уверены что хотите удалить этот элемент?</v-card-title >

                <v-card-text >
                    Его можно будет востановить. но это долго и сложно. Поэтому несколько раз подумайте.
                </v-card-text >

                <v-card-actions >
                    <div class="flex-grow-1" ></div >

                    <v-btn
                            color="green darken-1"
                            text
                            @click="dialog = false"
                    >
                        Отмена
                    </v-btn >

                    <v-btn
                            color="green darken-1"
                            text

                            @click="deleteItem"
                    >
                        Удалить
                    </v-btn >

                </v-card-actions >
            </v-card >
        </v-dialog >
    </div >
</template >

<script >
    const axios = require('axios');
    import HTTTP from '../http';
    export default {
        name: "delete-button",
        props: ['entity_name_ru',
            'entity_name_eng',
            'want_delete_id',
            'go_to',
            'check_data',
            'check_text']
        ,
        data: () => {
            return {
                dialog: false,
                loading: false,
            }
        },
        methods: {
            wantDelete(item_id) {
                this.dialog = true
            },
            deleteItem() {
                if (this.want_delete_id != null) {
                    HTTTP().delete('/' + this.entity_name_eng + '/' + this.want_delete_id,
                    ).then((response) => {
                        this.loading = false
                        this.dialog = false

                        let href = this.entity_name_eng
                        if (this.go_to === undefined) {
                            href = ''
                        } else {
                            href = this.go_to
                        }
                        this.$router.push('/' + href)
                    })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false
                            this.error_alert = true
                        });
                }
            }
        },
        computed: {
            check_t() {
                if (this.check_data === undefined){
                    return false
                } else{
                    return this.check_data
                }

            },

        }
    }
</script >

<style scoped >

</style >