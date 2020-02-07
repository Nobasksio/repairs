'use strict'

const Dbloger = use('App/Helpers/dbloger.js')
const Department = use('App/Models/Department')
const Equipment = use('App/Models/Equipment')
const Inventory = use('App/Models/Inventory')
const InventoryItems = use('App/Models/InventoryItems')
let moment = require('moment');

class InventoryController {

    async inventory({params, request, response}) {

        // Logger.transport('file').info('request is '+ new Date().toISOString()+' url: '+request.url()+' params:'+params.id , request.url())


        let inventory = await Inventory.findBy('id', params.id)

        await inventory.loadMany({
            InventoryItems: (builder) => {
                builder.where('isDelete', false)
            }
        })

        let inventoryEquipment = await inventory.Equipments().wherePivot('isDelete', false).fetch()


        inventory = inventory.toJSON();
        inventory.InventoryItems.forEach((item) => {

            for (let i = 0; i < inventoryEquipment.rows.length; i++) {

                if (item.equipment_id == inventoryEquipment.rows[i].id) {
                    item.equipment = inventoryEquipment.rows[i]
                }
            }

        })


        return response.json({
            inventory: inventory,
            inventoryEquipment: inventoryEquipment,

        })
    }

    async addInventoryItem({params, request, response}) {
        let inventory_item = new InventoryItems(),
            inventory_param = request.all().intentoryItem,
            equipment = await Equipment.findBy('id', inventory_param.equipment_id);

        inventory_item.inventory_id = inventory_param.inventory_id;
        inventory_item.equipment_id = inventory_param.equipment_id;
        inventory_item.status = inventory_param.status;
        inventory_item.cause = inventory_param.cause;
        inventory_item.isDelete = inventory_param.isDelete

        await inventory_item.save()

        return response.json({
            status: '200',
            inventory_item: inventory_item,
            equipment: equipment
        })

    }

    async updateInventoryItem({params, request, response}) {
        let inventory_param = request.all().intentoryItem,
            inventory_item = await InventoryItems.findBy('id', inventory_param.id);

        inventory_item.inventory_id
        inventory_item.equipment_id = inventory_param.equipment_id;
        inventory_item.status = inventory_param.status;
        inventory_item.cause = inventory_param.cause;
        inventory_item.isDelete = inventory_param.isDelete

        await inventory_item.save()

        return response.json({
            status: '200',
            inventory_item: inventory_item
        })

    }

    async list({request, response}) {

        let inventories = await Inventory.all()

        return inventories
    }

    async create({request, response, auth}) {
        let inventory_param = request.all().inventory,
            inventory,
            old_state,
            dbloger = new Dbloger(),
            new_state,
            equipments_list,
            user = await auth.getUser();

        if (inventory_param.id == null) {
            inventory = new Inventory();

        } else {

            inventory = await Inventory.findBy('id', inventory_param.id)

        }

        old_state = JSON.stringify(inventory)


        inventory.department_id = inventory_param.department_id
        inventory.user_create_id = user.id
        inventory.date_plan = moment(inventory_param.date_plan).format('YYYY-MM-DD HH:mm:ss');

        await inventory.save()

        equipments_list = await Equipment.query().where('isDelete', false).where('department_id', inventory.department_id).fetch()

        equipments_list.toJSON().forEach(async (item) => {
            let inventory_item = new InventoryItems();
            inventory_item.inventory_id = inventory.id
            inventory_item.equipment_id = item.id
            inventory_item.cause = 1

            await inventory_item.save()
        })

        return response.json({name: 'myau', inventory: inventory})
    }

    async update({request, response, auth}) {
        let inventory_param = request.all().inventory,
            inventory,
            dbloger = new Dbloger(),
            old_state,
            new_state,
            user = await auth.getUser();

        if (inventory_param.id == null) {
            inventory = new Inventory();

        } else {
            inventory = await Inventory.findBy('id', inventory_param.id)

        }

        old_state = JSON.stringify(inventory)

        for (let index in inventory) {
            if (inventory_param[index]) {
                inventory[index] = inventory_param[index]
            }
        }
        inventory.isClose = inventory_param.isClose

        await inventory.save()

        new_state = JSON.stringify(inventory)

        dbloger.createRecord(old_state, new_state, user.id, 'inventory')

        return response.json({status: '200', inventory:inventory})
    }

}

module.exports = InventoryController
