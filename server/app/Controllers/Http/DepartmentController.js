'use strict'

const Department = use('App/Models/Department')

const Equipment = use('App/Models/Equipment')

const Dbloger = use('App/Helpers/dbloger.js')

class DepartmentController {

    async department({params, request, response}) {
        let department = await Department.findBy('id', params.id)


        return response.json({
            department: department,
            count_eq: await Equipment.query().where('department_id', department.id).where('isDelete', false).getCount()
        })
    }

    async list({request, response}) {

        let Departments_list = await Department.query().where('isDelete', false).fetch()

        return Departments_list
    }

    async list_tree({request, response}) {

        let Departments_list = await Department.query().where('isDelete', false).fetch()
        let delete_position = []
        Departments_list = Departments_list.toJSON()

        for(let i = 0; i < Departments_list.length; i++){

            Departments_list[i].count_eq = await Equipment.query().where('department_id', Departments_list[i].id).where('isDelete', false).getCount()

        }

        Departments_list.forEach((item, i, arr) => {
            if (item.parent != null) {
                let parent = []
                     parent = Departments_list.filter((item_2) => {
                    return item_2.id == item.parent
                })

                if (parent.length > 0) {

                    if (parent[0]['children'] === undefined) {
                        parent[0]['children'] = []
                    }
                    parent[0]['children'].push(item)
                } else {
                    Departments_list[i].parent = null
                }


            }
        })

        let response_arr = Departments_list.filter((item) => {
            return item.parent == null
        })
        return response_arr
    }

    async create({request, response,auth}) {

        let department_param = request.all().department

        let department,
            old_state,
            new_state,
            dbloger = new Dbloger(),
            user = await auth.getUser();

        if (department_param.id == null){
            department = new Department();

        } else {

            department = await Department.findBy('id', department_param.id)

        }

        old_state = JSON.stringify(department)
        department.isDelete = false
        department.name = department_param.name

            if (department_param.parent_id == null) {
                department.parent = null
            } else {
                department.parent = department_param.parent_id;
            }




        department.sort = department_param.sort

        try {
            await department.save()
            /*
               save new state and save history
            */
            new_state = JSON.stringify(department)
            dbloger.createRecord(old_state,new_state,user.id,'department')
            return response.json({massage: 'всё ок'})
        } catch (e) {
            console.log(e)
            return response.json({massage: 'возникла ошибка при сохранении'})
        }


    }

    async delete({params, request, response,auth}) {

        let department = await Department.findBy('id', params.id),
            old_state,
            new_state,
            user = await auth.getUser(),
            dbloger = new Dbloger();

        old_state = JSON.stringify(department)
        department.isDelete = true

        await department.save()

        new_state = JSON.stringify(department)
        dbloger.createRecord(old_state,new_state,user.id,'department')

        return response.json({
            department: department,
            massage: 'подразделение успешно удалено',
            status: 'ok'
        })

    }


}

module.exports = DepartmentController
