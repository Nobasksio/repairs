'use strict'

const Repair = use('App/Models/Repair')
const Equipment = use('App/Models/equipment')
const Department = use('App/Models/Department')
const Provider = use('App/Models/Provider')

var moment = require('moment');

class RepairController {

    async repair({params, request, response}) {
        let repair = await Repair.findBy('id', params.id)


        return response.json({
            repair: repair,
        })
    }

    async list({request, response}) {
        let repair_list = await Repair.query().where('isDelete', false).fetch()
        repair_list = repair_list.toJSON()

        let equipments_id_arr = []
        let equipments = []

        let departments_id_arr = []
        let departments = []

        let provider_list = await Provider.query().where('isDelete', false).fetch()
        for (let i = 0; i < repair_list.length; i++){

            let item = repair_list[i]

            if (equipments_id_arr.indexOf(item.equipment_id) == -1){

                equipments_id_arr.push(item.equipment_id)
                let equipment_item = await Equipment.findBy('id', item.equipment_id)

                equipments.push(equipment_item)
            }

            if (departments_id_arr.indexOf(item.department_id) == -1 && item.department_id != null){

                departments_id_arr.push(item.department_id)
                let department_item = await Department.findBy('id', item.department_id)

                departments.push(department_item)
            }

        }

        return response.json({
            repair : repair_list,
            equipments: equipments,
            department:departments,
            providers:provider_list
        })
    }

    async create({request, response}) {



        let repair_param = request.all().repair
        let repair;
        if (repair_param.id == null){
            repair = new Repair();

        } else {

            repair = await Repair.findBy('id', repair_param.id)

        }

        repair.date_start = moment(repair_param.date_start).format('YYYY-MM-DD HH:mm:ss');
        repair.description = repair_param.description
        repair.isWarranty = repair_param.isWarranty

        if (repair_param.date_finish != null){
            repair.date_finish = moment(repair_param.date_finish).format('YYYY-MM-DD HH:mm:ss');
        } else {
            repair.date_finish = null
        }
        repair.isDelete = false
        repair.department_id = repair_param.equipment.department_id
        repair.price = repair_param.price
        repair.equipment_id = repair_param.equipment.id
        repair.provider_id = repair_param.provider_id

        await repair.save()


        return response.json({massage: 'ok', id: repair.id})

    }
    async delete({params,request, response}) {

        let repairs = await Repair.findBy('id', params.id)

        repairs.isDelete = true

        await repairs.save()

        return response.json({
            repairs:repairs,
            massage:'ремонт успешно удален',
            status:'ok'
        })

    }
}

module.exports = RepairController
