<template >
    <v-card
            class=""
            max-width="300"
            flat >
        <v-list>

            <v-list-item-group v-model="item" color="primary">
                <v-list-item
                        v-for="(item, i) in providers"
                        :key="i"
                        @click="editItem(item)"
                >
                    <v-list-item-content>
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon >
                        <v-icon>mdi-pencil-outline</v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list-item-group>
        </v-list>
        <v-row>
            <v-col >
                <v-btn to='/provider/create' color="primary" class=" mx-4 my-4" >Создать нового
                </v-btn >
            </v-col>
        </v-row>
    </v-card>
</template >

<script >
    const axios = require('axios');
    import HTTTP from '../../http';
    export default {
        name: "provider-list",
        data:()=>{
            return {
                item: null,
                providers:[]
            }
        },
        mounted(){
            HTTTP().get('/lists' )
                .then((response)=> {
                    this.providers.splice(0, this.providers.length, ...response.data.providers);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        methods:{
            editItem(group){
                this.$router.push('/provider/edit/'+group.id)
            }
        }
    }
</script >

<style scoped >

</style >