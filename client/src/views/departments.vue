<template >
    <div>
        <v-row >
            <v-col lg="4" md="6" cols="12" >
                <v-treeview
                        dense
                        :items="items"

                >
                    <template v-slot:label="{ item ,open}" >
                        <div class="py-3">

                            <span>{{item.name}}</span>
                            <span class="d-block grey--text pr-10">{{item.count_eq}} шт</span>

                        </div>
                    </template >
                    <template v-slot:append="{ item, open }" >
                        <v-list-item-icon @click="editItem(item)">
                            <v-icon>mdi-pencil-outline</v-icon>
                        </v-list-item-icon>
                    </template >
                </v-treeview >
            </v-col >
        </v-row >
        <v-row >
            <v-col cols="4" >
                <v-btn to='/department/create' color="primary" class="m-2" >Создать новое
                </v-btn >
            </v-col >
        </v-row >
    </div >
</template >

<script >
    const axios = require('axios');
    export default {
        name: "department-list",
        mounted() {
            axios.get('/api/department/tree')
                .then((response) => {
                    this.items.splice(0, this.items.length, ...response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        data: () => ({
            items: [],
        }),
        methods:{
            editItem(department){
                this.$router.push('/department/edit/'+department.id)
            }
        }
    }
</script >

<style scoped >

</style >