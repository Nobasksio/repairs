<template >
    <v-card
            class=""
            max-width="300"
            flat
    >
    <v-list>

        <v-list-item-group v-model="item" color="primary">
            <v-list-item
                    v-for="(item, i) in groups"
                    :key="i"
            >
                <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon @click="editItem(item)">
                    <v-icon>mdi-pencil-outline</v-icon>
                </v-list-item-icon>
            </v-list-item>
        </v-list-item-group>
    </v-list>
        <v-row>
            <v-col >
                <v-btn to='/group/create' color="primary" class=" mx-4 my-4" >Создать новую
                </v-btn >
            </v-col>
        </v-row>
    </v-card>
</template >

<script >
    const axios = require('axios');
    export default {
        name: "group-list",
        data:()=>{
            return {
                item: null,
                groups:[]
            }
        },
        mounted(){
            axios.get('/api/lists' )
                .then((response)=> {
                    this.groups.splice(0, this.groups.length, ...response.data.type);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        methods:{
            editItem(group){
                this.$router.push('/group/edit/'+group.id)
            }
        }
    }
</script >

<style scoped >

</style >