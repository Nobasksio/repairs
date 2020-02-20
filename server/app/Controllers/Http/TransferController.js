'use strict'

const Transfer = use('App/Models/Transfer')
const Equipment = use('App/Models/Equipment')
const Department = use('App/Models/Department')
const Dbloger = use('App/Helpers/dbloger.js')

var moment = require('moment');

class TransferController {

    async transfer({params, request, response}) {
        let transfer = await Transfer.findBy('id', params.id)


        return response.json({
            transfer: transfer,
        })
    }

    async create({request, response,auth}) {

        let transfer_param = request.all().transfer,
            transfer,
            action = '',
            new_tr = true,
            user = await auth.getUser(),
            old_state,
            equipments = [],
            dbloger = new Dbloger(),
            new_state;


        if (request.all().equipments !== undefined){
            equipments = request.all().equipments
        } else {
            equipments = [transfer_param.equipment]
        }



        for(let i = 0; i < equipments.length; i++) {

            if (transfer_param.id == null){

                transfer = new Transfer();
                action = 'add'

            } else {

                new_tr = false
                transfer = await Transfer.findBy('id', transfer_param.id)
                action = 'update'

            }

            old_state = JSON.stringify(transfer)

            transfer.equipment_id = equipments[i].id
            transfer.description = transfer_param.description
            transfer.from_dep_id = transfer_param.from_dep_id
            transfer.to_dep_id = transfer_param.to_dep_id
            transfer.user_id = user.id

            if (new_tr) {
                let equipment = await Equipment.findBy('id', equipments[i].id)
                equipment.department_id = transfer.to_dep_id

                await equipment.save()
            }

            transfer.date_start = moment(transfer_param.date_start).format('YYYY-MM-DD HH:mm:ss');
            transfer.date_finish = moment(transfer_param.date_finish).format('YYYY-MM-DD HH:mm:ss');


            await transfer.save()

            /*
            save new state and save history
            */
            new_state = JSON.stringify(transfer)
            dbloger.createRecord(old_state, new_state, user.id, 'transfer', transfer.id)

        }

        return response.json({
            status: 'ok',
            action:action,
            id:transfer.id
        })
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
