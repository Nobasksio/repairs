<template >
    <v-data-table
            :headers="headers"
            :items="filter_equipments"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            class="elevation-1 "
            @page-count="pageCount = $event"
    >
        <template v-slot:item.name="{ item }" >
            {{ (getEquipment(item.equipment_id)).name }}
        </template >
        <template v-slot:item.department="{ item }" >
            {{ (getDepartment(item.department_id)).name }}
        </template >
        <template v-slot:item.provider_id="{ item }" >
            {{ (getProvider(item.provider_id)).name}}
        </template >
        <template v-slot:item.date_start="{ item }" >
            {{ date_format(item.date_start)}}
        </template >
        <template v-slot:item.date_finish="{ item }" >
            {{ date_format(item.date_finish)}}
        </template >
        <template v-slot:item.warranty="{ item }" >
            {{ item.isWarranty ? 'да': 'Нет'}}
        </template >
        <template v-slot:item.action="{ item }" >
            <v-icon
                    small
                    class="mx-5"
                    @click="editItem(item)"
            >
                more_horiz
            </v-icon >
            <v-icon
                    small
                    class="mr-5"
                    @click="editItem(item)"
            >
                edit
            </v-icon >
        </template >
    </v-data-table >
</template >

<script >
    export default {
        name: "inventories",
        data() {
            return {
                headers: [
                    {
                        text: 'Подразделение',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Дата', value: 'department' },
                    { text: 'Отвественный', value: 'date_start' },
                    { text: 'Корректировок', value: 'provider_id' },
                ],
            }
        }
    }
</script >

<style scoped >

</style >