<template >
    <div
            class="fill-height"
            fluid
    >
        <v-form v-model="valid" >
        <h1 class="display-1" >Создание Инвенторизации</h1 >
        <v-container
                class="fill-height"
                fluid
        >

            <v-row >
                <v-col cols="4" class="pb-0" >
                    <v-autocomplete
                            v-model="inventory.department_id"
                            label="Название"
                            placeholder="например Чайник"
                            :items="departments"
                            item-text="name"
                            :rules="[v => !!v || 'Подразделение не может быть пустым']"
                            item-value="id"
                            outlined
                            class="mr-2 mb-0"
                    >
                        <template v-slot:item="data" >
                            <template >
                                <v-list-item-content >
                                    <v-list-item-title v-html="data.item.name" ></v-list-item-title >
                                    <v-list-item-subtitle
                                            v-html="(getDepartment(data.item.id)).name" ></v-list-item-subtitle >
                                </v-list-item-content >
                            </template >
                        </template >
                    </v-autocomplete >
                </v-col >
            </v-row >
            <v-row >
                <v-col cols="4" class="pb-0" >
                    <v-menu
                            ref="date_menu"
                            v-model="date_menu"
                            :close-on-content-click="false"

                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                    >
                        <template v-slot:activator="{ on }" >
                            <v-text-field
                                    label="Дата"
                                    placeholder="гггг-мм-дд"
                                    outlined
                                    v-model="inventory.date_finish"
                                    v-on="on"
                            >
                            </v-text-field >
                        </template >
                        <v-date-picker v-model="inventory.date_finish"
                                       no-title
                                       scrollable
                                       @change="date_menu = false"
                        >
                            <div class="flex-grow-1" ></div >
                        </v-date-picker >
                    </v-menu >
                </v-col >
            </v-row >
            <v-row >
                <v-col cols="4" >
                    <v-btn color="primary" class="m-2"
                           :disabled="loading || !valid"
                           large @click="create_inventory()" >{{name_button}}
                    </v-btn >
                </v-col >
            </v-row >

        </v-container >
        </v-form>
    </div >
</template >

<script >
    import HTTTP from '../../http';

    export default {
        name: "inventory-create",
        mounted() {
            HTTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        data() {
            return {
                departments: [],
                date_menu: false,
                valid: false,
                loading:false,
                succ_alert:false,
                name_button: 'Сохранить',
                inventory: {
                    id:null,
                    date_finish:null,
                    department_id: null,}
            }
        },
        methods:{
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
            create_inventory(){

                HTTTP().post('/inventory', {inventory:this.inventory},
                )
                    .then(({data})=> {
                        this.loading = false
                        this.succ_alert = true
                        this.name_button = 'Сохранить изменения'
                        this.inventory.id = data.inventory.id
                    })
                    .catch((error)=> {
                        console.log(error);
                        this.loading = false
                        this.error_alert = true
                    });
            },
        }
    }
</script >

<style scoped >

</style >