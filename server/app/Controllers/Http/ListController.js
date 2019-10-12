'use strict'


const TypeEq = use('App/Models/TypeEq')
const ClassEq = use('App/Models/ClassEq')
const Department = use('App/Models/Department')
const Provider = use('App/Models/Provider')

class ListController {

    async main({request,response}){

        let type_list = await TypeEq.query().where('isDelete', false).fetch()
        let departments_list = await Department.query().where('isDelete', false).fetch()
        let provider_list = await Provider.query().where('isDelete', false).fetch()



        return {
            type:type_list,
            department: departments_list,
            providers:provider_list
        }
    }


}

module.exports = ListController
