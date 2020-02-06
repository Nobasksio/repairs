<template >
    
</template >

<script >
    export default {
        name: "base-getters",
        data: function(){
            return {
                departments:[],
                group_eq:[],
            }
        },
        methods: {
            getEquipment(equipment_id) {
                let our_equipment = this.equipment.filter((item) => {
                    return item.id == equipment_id
                })
                if (our_equipment.length == 0) {
                    our_equipment = [{name: ''}]
                }
                return our_equipment[0]
            },
            getGroup(type_id) {
                let our_group = this.group_eq.filter((item) => {
                    return item.id == type_id
                })
                if (our_group.length == 0) {
                    our_group = [{name: ''}]
                }
                return our_group[0]
            },
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
        }
    }
</script >

<style scoped >

</style >