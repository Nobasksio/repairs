<template >
    
</template >

<script >
    export default {
        name: "base-list",
        methods:{
            getEquipment(equipment_id) {
                let our_equipment = this.equipments.filter((item) => {
                    return item.id == equipment_id
                })
                if (our_equipment.length == 0){
                    our_equipment = [{name:''}]
                }
                return our_equipment[0]
            },
            getDepartment(department_id) {
                let our_department = []

                our_department = this.departments.filter((item) => {
                    return item.id == department_id
                })
                if (our_department.length == 0){
                    our_department = [{name:'подразделение удалено'}]
                }

                return our_department[0]
            },
            getProvider(provider_id){
                let our_provider = []
                our_provider = this.providers.filter((item) => {
                    return item.id == provider_id
                })
                if (our_provider.length == 0){
                    our_provider = [{name:'поcтавщик удален'}]
                }
                return our_provider[0]
            },
            date_format(date){
                let new_date = ''
                if (date != null){
                    new_date = date.substr(0,10)
                } else {
                    new_date = ''
                }
                return new_date
            },
            editItem (entity_name,item) {
                this.$router.push(`/${entity_name}/edit/${item.id}`)
            },
            showItem (entity_name,item) {
                this.$router.push(`/${entity_name}/${item.id}`)
            },
        }
    }
</script >

<style scoped >

</style >