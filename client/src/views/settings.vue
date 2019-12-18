<template >
    <div >
        <h1 class="display-1" >Настройки</h1 >
        <v-tabs
                v-model="tab" >
            <v-tabs-slider ></v-tabs-slider >
            <v-tab href="#tab-1" >Подразделения</v-tab >
            <v-tab href="#tab-2" >Группы оборудования</v-tab >
            <v-tab href="#tab-3" >Поставщики</v-tab >
            <!--<v-tab href="#tab-4" >Пользователи</v-tab >-->
        </v-tabs >
        <v-tabs-items v-model="tab" >
            <v-tab-item value="tab-1" >
                <v-card flat >
                    <DepartmentsList>
                    </DepartmentsList>
                </v-card>
            </v-tab-item>
            <v-tab-item
                    value="tab-2" >
                <v-card flat >
                    <group-list></group-list>
                </v-card>
            </v-tab-item>
            <v-tab-item
                    value="tab-3" >
                <v-card flat >
                    <provider-list></provider-list>
                </v-card>
            </v-tab-item>
            <!--<v-tab-item-->
                <!--value="tab-4" >-->
                <!--<v-card flat >-->
                <!--</v-card>-->
            <!--</v-tab-item>-->
        </v-tabs-items>


    </div >
</template >

<script >
    import DepartmentsList from './department/departments.vue';
    import groupList from './group-list';
    import providerList from './provider/provider-list';
    export default {
        name: "settings",
        components:{
            DepartmentsList,
            groupList,
            providerList
        },
        data:()=>{
            return {
                tab: null
            }
        }
    }
</script >

<style scoped >

</style >