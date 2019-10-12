'use strict'

const Department = use('App/Models/Department')

class DepartmentController {

    async department({params, request, response}) {
        let department = await Department.findBy('id', params.id)


        return response.json({
            department: department,
        })
    }
    async list({request,response}){
        console.log('start')
        let Departments_list = await Department.query().where('isDelete', false).fetch()

        return Departments_list
    }
    async list_tree({request,response}){
        console.log('start')
        let Departments_list = await Department.query().where('isDelete', false).fetch()
        let delete_position = []
        Departments_list = Departments_list.toJSON()


        Departments_list.forEach((item,i,arr)=>{
            if (item.parent != null){
                let parent = Departments_list.filter((item_2)=>{
                    return item_2.id == item.parent
                })

                try {
                    parent[0]['children'].length
                    parent[0]['children'].push(item)
                } catch (e) {
                    Departments_list[i].parent = null
                }





            }
        })

        let response_arr = Departments_list.filter((item)=>{
            return item.parent == null
        })
        return response_arr
    }

    async create({request,response}){

        let department_param = request.all().department

        const department = new Department();

        console.log(department_param)

        department.name = department_param.name
        try {
            department.parent = department_param.parent_id
        } catch (e) {
            department.parent = null
        }

        department.sort = department_param.sort

        try {
            await department.save()
            return response.json({ massage: 'всё ок'})
        } catch (e) {
            return response.json({ massage: 'возникла ошибка при сохранении'})
        }


    }
    async delete({params,request, response}) {

        let department = await Department.findBy('id', params.id)

        department.isDelete = true

        await department.save()

        return response.json({
            department:department,
            massage:'подразделение успешно удалено',
            status:'ok'
        })

    }


}

module.exports = DepartmentController
