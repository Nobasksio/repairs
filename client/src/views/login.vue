<template >
    <div>
        <v-data-table
                :headers="headers"
                :items="desserts"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                class="elevation-1"
                @page-count="pageCount = $event"
        >
            <template v-slot:item.action="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    edit
                </v-icon>
                <v-icon
                        small
                        @click="deleteItem(item)"
                >
                    delete
                </v-icon>
            </template>
        </v-data-table>
    </div>
</template >

<script >
    export default {
        name: "login",
        data: () => {
            return {
                valid:false,
                user: {
                    email: null,
                    password: null,
                },

            }
        },
        methods:{
            login() {

                axios.post('/api/login',
                    {user: this.user}
                ).then((response) => {
                    this.loading = false
                    this.succ_alert = true
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('email', user.email);
                    this.name_button = 'сохранить'
                })
                    .catch((error) => {
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