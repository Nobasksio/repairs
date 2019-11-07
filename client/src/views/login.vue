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
    import HTTTP from '../http';
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

        }
    }
</script >

<style scoped >

</style >