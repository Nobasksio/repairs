'use strict'

const Logger = use('Logger')

const Equipment = use('App/Models/Equipment')
const Department = use('App/Models/Department')
const Photo = use('App/Models/Photo')
const Dbloger = use('App/Helpers/dbloger.js')

let moment = require('moment');

const Helpers = use('Helpers')

class EquipmentController {

    async equipment({params, request, response}) {

        Logger.transport('file').info('request is '+ new Date().toISOString()+' url: '+request.url()+' params:'+params.id , request.url())


        let equipment = await Equipment.findBy('id', params.id)

        const equipmentDepartment = await equipment
            .Department()
            .where('isDelete', false)
            .fetch()
        const typeEq = await equipment.TypeEq().where('isDelete', false)
            .orderBy('name', 'desc').fetch()
        const repairs = await equipment.Repairs().where('isDelete', false).fetch()
        const photos = await equipment.Photos().where('isDelete', false).fetch()
        const transfers = await equipment.Transfers().where('isDelete', false).fetch()

        equipment.photo = photos

        return response.json({
            equipment: equipment,
            equipmentDepartments:equipmentDepartment,
            typeEq: typeEq,
            repairs:repairs,
            photo:photos,
            transfers:transfers
        })
    }

    async list({request, response}) {


        let equipments_list = await Equipment.query().where({
            isDelete: false,
            is_out_of_order: false
        }).fetch()

        return equipments_list
    }

    async create({request, response, auth}) {

        // Logger.transport('file').info('request url is %s', request.url())
        //
        // Logger.transport('file').info('request details %j', {
        //     url: request.url(),
        // })

        let equipment_param = request.all().equipment

        let equipment,
            old_state,
            dbloger = new Dbloger(),
            new_state,
            user = await auth.getUser();

        if (equipment_param.id == null){
            equipment = new Equipment();

        } else {

            equipment = await Equipment.findBy('id', equipment_param.id)

        }

        /*
        save old state for history
        */

        old_state = JSON.stringify(equipment)

        equipment.name = equipment_param.name
        equipment.provider_id = equipment_param.provider_id
        equipment.isDelete = false
        equipment.description = equipment_param.description
        equipment.out_number = equipment_param.out_number
        equipment.in_number_uniq = equipment_param.in_number_uniq

        equipment.date_buy = moment(equipment_param.date_buy).format('YYYY-MM-DD HH:mm:ss');
        // equipment.date_buy = ''+equipment_param.date_buy+' 00:00:00'


        let date_buy = moment(equipment_param.date_buy)
        let warranty = moment(equipment_param.warranty)

        let razn = warranty - date_buy

        equipment.isWarranty = !equipment_param.noWarranty

        if (equipment.warranty != null){
            equipment.warranty = moment(equipment_param.warranty).format('YYYY-MM-DD HH:mm:ss');
        } else {
            equipment.warranty = null
        }

        equipment.price = +equipment_param.price
        equipment.class_eq_id = equipment_param.class_eq_id
        equipment.type_eq_id = equipment_param.type_eq_id
        equipment.department_id = equipment_param.department_id

        await equipment.save()


        /*
         save new state and save history
        */
        new_state = JSON.stringify(equipment)
        dbloger.createRecord(old_state,new_state,user.id,'equipment',equipment.id)

        for (let i=0; i < equipment_param.photo.length; i++){

            let photo = await Photo.findBy('id', equipment_param.photo[i].id)

            photo.entity_id = equipment.id

            photo.save()
        }

        return response.json({name: 'myau', id: equipment.id})
    }

    async setOutOfOrder({request, response, auth}) {
        let old_state,
            dbloger = new Dbloger(),
            new_state,
            user = await auth.getUser();

        const equipment_id = request.all().equipment_id;
        const state = request.all().state;
        const comment = request.all().comment;
        const equipment = await Equipment.findBy('id', equipment_id);

        old_state = JSON.stringify(equipment)
        equipment.is_out_of_order = state;
        equipment.out_of_order_comment = comment;


        await equipment.save();

        new_state = JSON.stringify(equipment)
        dbloger.createRecord(old_state,new_state,user.id,'equipment',equipment.id)


        return response.json({message: 'Оборудование успешно списано', id: equipment.id})

    }

    async upload({params,request, response}) {

        Logger.transport('file').info('request url is %s', request.url())

        Logger.transport('file').info('request details %j', {
            url: request.url(),
        })

        const profilePic = request.file('file', {
            types: ['image'],
            size: '10mb'
        })

        console.log(request)

        let name_file = `${new Date().getTime()}.${profilePic.subtype}`
        await profilePic.move(Helpers.appRoot('/public/uploads/'), {
            name: name_file,
            overwrite: true
        })

        console.log(profilePic)

        if (!profilePic.moved) {
            return profilePic.errors()
        }

        const photo = new Photo();

        photo.link = name_file
        photo.type = params.type
        photo.isDelete = false

        await photo.save()

        return response.json({link:name_file,
            type:params.type,
        id:photo.id})
    }

    async checkNumber({params,request,response}){
        let number = request.all().number,
            equipment = await Equipment.findBy('in_number_uniq', number);

        if (equipment) return response.send(false)
        else return response.send(true)
    }
    async delete({params,request, response,auth}) {

        let equipment = await Equipment.findBy('id', params.id),
            old_state,
            new_state,
            user = await auth.getUser(),
            dbloger = new Dbloger();

        old_state = JSON.stringify(equipment)
        equipment.isDelete = true

        await equipment.save()

        new_state = JSON.stringify(equipment)
        dbloger.createRecord(old_state,new_state,user.id,'equipment',equipment.id)

        return response.json({
            equipment:equipment,
            massage:'оборудование успешно удалено',
            status:'ok'
        })

    }

    async delete_photo({params,request, response}) {

        Logger.transport('file').info('request url is %s', request.url())

        Logger.transport('file').info('request details %j', {
            url: request.url(),
        })

        let photo = await Photo.findBy('id', params.id)

        photo.isDelete = true

        await photo.save()

    }
}

module.exports = EquipmentController
