<template >

</template >

<script >
    export default {
        name: "base-transfer",
        data: function () {
            return {
                menu: false,
                name_button: 'Сохранить',
                menu2: false,
                valid: false,
                loading: false,
                succ_alert: false,
                succ_text: 'Оборудование успешно добавлено',
                error_alert: false,
                search_name: null,
                search_in_number_uniq: null,
                search_from_dep_id: null,
                filter: {
                    department: null,
                },
                departments: [],
                equipments: [],
                transfer: {
                    id: null,
                    from_dep_id: null,
                    to_dep_id: null,
                    equipment: {id: null},
                    user_id: null,
                    description: '',
                    isDelete: false,
                    date_start: new Date().toISOString().substr(0, 10),
                    date_finish: new Date().toISOString().substr(0, 10),
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        mounted() {
            this.HTTP().get('/lists')
                .then((response) => {
                    this.departments.splice(0, this.departments.length, ...response.data.department);

                })
                .catch(function (error) {
                    console.log(error);
                })


            this.HTTP().get('/equipments')
                .then((response) => {
                    this.equipments.splice(0, this.equipments.length, ...response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        methods: {
            create_transfer() {
                this.HTTP().post('/transfer', {transfer: this.transfer},
                ).then((response) => {

                    if (response.data.action == 'add') {
                        this.succ_text = 'Перемещение успешно проведено'
                    } else {
                        this.succ_text = 'Перемещение успешно обновлено '
                    }

                    this.error_alert = false
                    this.succ_alert = true
                    this.transfer.id = response.data.id
                }).catch((error) => {
                    this.succ_alert = false
                    this.error_alert = true
                    console.log(error);
                });
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
        },
        computed: {
            filter_equipments() {
                let filtred;

                if (this.filter.department != null) {

                    filtred = this.equipments.filter((item) => {

                        let step = false;

                        if (item.department_id == this.filter.department) {

                            step = true

                        }

                        return step

                    })
                } else {

                    filtred = this.equipments
                }

                return filtred
            },
            filtred_departments_to() {
                let filtred;
                if (this.transfer.equipment.id != null) {
                    filtred = this.departments.filter((item) => {

                        return item.id != this.transfer.equipment.department_id

                    })
                } else {
                    filtred = this.departments
                }

                return filtred
            }
        },
        watch: {
            search_name: function (val, oldval) {

                if (val != oldval) {
                    let eq_serach = this.equipments.filter((item) => {
                        return item.id == val
                    })
                    this.transfer.equipment = eq_serach[0]

                    this.search_in_number_uniq = this.transfer.equipment.id
                    this.search_from_dep_id = this.transfer.equipment.department_id
                    this.transfer.from_dep_id = this.transfer.equipment.department_id
                }
            },
            search_in_number_uniq: function (val, oldval) {

                let eq_serach = this.equipments.filter((item) => {
                    return item.id == val
                })
                this.transfer.equipment = eq_serach[0]
                this.search_name = this.transfer.equipment.id
                this.search_from_dep_id = this.transfer.equipment.department_id
                this.transfer.from_dep_id = this.transfer.equipment.department_id

            },
            search_from_dep_id: function (val, oldval) {

                this.filter.department = val

                if (val != this.transfer.equipment.department_id) {
                    this.transfer.equipment = {id: null}

                }
                this.transfer.from_dep_id = val

            }
        }
    }
</script >

<style scoped >

</style >