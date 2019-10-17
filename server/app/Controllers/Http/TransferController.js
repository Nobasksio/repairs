'use strict'

const Transfer = use('App/Models/Transfer')

const Equipment = use('App/Models/Equipment')

const Department = use('App/Models/Department')

var moment = require('moment');

class TransferController {

    async transfer({params, request, response}) {
        let transfer = await Transfer.findBy('id', params.id)


        return response.json({
            transfer: transfer,
        })
    }

    async create({request, response}) {

        let transfer_param = request.all().transfer
        let transfer;
        let action = ''
        if (transfer_param.id == null){

            transfer = new Transfer();
            action = 'add'
        } else {

            transfer = await Transfer.findBy('id', transfer_param.id)
            action = 'update'
        }


        transfer.equipment_id = transfer_param.equipment.id
        transfer.description = transfer_param.description
        transfer.from_dep_id = transfer_param.from_dep_id
        transfer.to_dep_id = transfer_param.to_dep_id

        let equipment = await Equipment.findBy('id', transfer_param.equipment.id)

        equipment.department_id = transfer.to_dep_id

        transfer.date_start = moment(transfer_param.date_start).format('YYYY-MM-DD HH:mm:ss');
        transfer.date_finish = moment(transfer_param.date_finish).format('YYYY-MM-DD HH:mm:ss');

        await equipment.save()
        await transfer.save()

        return response.json({status: 'ok',
            action:action,
            id:transfer.id})
    }
    async list({request, response}) {
        let transfer_list = await Transfer.query().where('isDelete', false).fetch()

        transfer_list = transfer_list.toJSON()

        let equipments_id_arr = []
        let equipments = []

        let departments = await Department.all()

        for (let i = 0; i < transfer_list.length; i++){

            let item = transfer_list[i]

            if (equipments_id_arr.indexOf(item.equipment_id) == -1){

                equipments_id_arr.push(item.equipment_id)
                let equipment_item = await Equipment.findBy('id', item.equipment_id)

                equipments.push(equipment_item)
            }


        }


        return response.json({
            transfer : transfer_list,
            equipment: equipments,
            department:departments
        })
    }
    async delete({params,request, response}) {

        let transfer = await Transfer.findBy('id', params.id)

        transfer.isDelete = true

        await transfer.save()

        return response.json({
            transfer:transfer,
            massage:'перемещение успешно удалено',
            status:'ok'
        })

    }


}

module.exports = TransferController
