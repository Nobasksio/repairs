<template >
    <v-data-table
            :headers="headers"
            :items="filter_inventories"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            class="elevation-1 "
            @page-count="pageCount = $event"
    >
        <template v-slot:item.department="{ item }" >
            {{ (getDepartment(item.department_id)).name }}
        </template >
        <template v-slot:item.date_plan="{ item }" >
            {{ date_format(item.date_plan)}}
        </template >
        <template v-slot:item.date_finish="{ item }" >
            {{ date_format(item.date_finish)}}
        </template >
        <template v-slot:item.action="{ item }" >
            <v-icon
                    small
                    class="mx-5"
                    @click="showItem('inventory',item)"
            >
                more_horiz
            </v-icon >
            <v-icon
                    small
                    class="mr-5"
                    @click="editItem('inventory',item)"
            >
                edit
            </v-icon >
        </template >
    </v-data-table >
</template >

<script >
    import HTTTP from '../../http';
    import baseList from '../../components/base-list/base-list'
    export default {
        name: "inventories",
        mixins: [baseList],
        mounted() {
            HTTTP().get('/inventory')
                .then((response) => {
                    console.log(response.data)
                    this.inventories.splice(0, this.inventories.length, ...response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
            HTTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        data() {
            return {
                inventories:[],
                itemsPerPage:15,
                departments:[],
                page:1,
                filter: {
                    department: [],
                    date_start: null,
                    date_finish: null,
                },
                headers: [
                    {
                        text: 'Подразделение',
                        align: 'left',
                        sortable: false,
                        value: 'department',
                    },
                    { text: 'Дата', value: 'date_plan' },
                    { text: 'Отвественный', value: 'date_start' },
                    { text: 'Корректировок', value: 'provider_id' },
                    { text: 'Actions', value: 'action', sortable: false,align: 'center', },
                ],
            }
        },
        computed: {
            filter_inventories() {
                let filtred;

                if (this.filter.department.length > 0) {
                    filtred = this.inventories.filter((item) => {
                        let step = false;
                        for (let i = 0; i < this.filter.department.length; i++) {
                            if (item.department_id == this.filter.department[i]) {
                                step = true
                                break;
                            }
                        }
                        return step

                    })
                } else {
                    filtred = this.inventories
                }



                if (this.filter.date_start != null) {
                    console.log(moment(this.filter.date_start))
                    filtred = filtred.filter((item) => {
                        console.log(moment(item.date_start.substr(0, 10)))
                        if (moment(item.date_start.substr(0, 10)) >= moment(this.filter.date_start)) {
                            return true
                        }

                    })
                }

                if (this.filter.date_finish != null) {
                    filtred = filtred.filter((item) => {

                        if (moment(item.date_start.substr(0, 10)) <= moment(this.filter.date_finish)) {
                            return true
                        }

                    })
                }

                return filtred
            },
        }
    }
</script >

<style scoped >

</style >