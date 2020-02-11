'use strict'

const Dbloger = use('App/Helpers/dbloger.js')
const Department = use('App/Models/Department')
const Equipment = use('App/Models/Equipment')
const Inventory = use('App/Models/Inventory')
const InventoryItems = use('App/Models/InventoryItems')
let moment = require('moment');

class InventoryController {


    constructor(){
        this.dbloger = new Dbloger();
        this.user;
        this.entity_name = 'inventory'
    }

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
        let inventory_item,
            inventoryItem_param = request.all().intentoryItem,
            equipment = await Equipment.findBy('id', inventoryItem_param.equipment_id);


        inventory_item = await InventoryItems.findBy({
            equipment_id:inventoryItem_param.equipment_id,
            inventory_id:inventoryItem_param.inventory_id });


        if (inventory_item){
            return response.json({
                status: 'exist',
                inventory_item: inventory_item
            })
        } else {
            inventory_item = new InventoryItems();
        }

        inventory_item.inventory_id = inventoryItem_param.inventory_id;
        inventory_item.equipment_id = inventoryItem_param.equipment_id;
        inventory_item.status = inventoryItem_param.status;
        inventory_item.cause = inventoryItem_param.cause;
        inventory_item.isDelete = inventoryItem_param.isDelete


        await inventory_item.save()

        inventory_item.equipment = equipment
        return response.json({
            status: 'added',
            inventory_item: inventory_item
        })

    }

    async updateInventoryItem({params, request, response,auth}) {
        let inventory_param = request.all().intentoryItem,
            inventory_item = await InventoryItems.findBy('id', inventory_param.id),
            old_state = JSON.stringify(inventory_item),
            new_state;

        this.user = auth.user;
        inventory_item.inventory_id
        inventory_item.equipment_id = inventory_param.equipment_id;
        inventory_item.status = inventory_param.status;
        inventory_item.cause = inventory_param.cause;
        inventory_item.isDelete = inventory_param.isDelete

        await inventory_item.save()

        new_state = JSON.stringify(inventory_item)


        this.dbloger.createRecord(old_state,new_state,this.user.id,'inventoryItem',new_state.id)

        return response.json({
            status: '200',
            inventory_item: inventory_item
        })

    }

    async list({request, response}) {

        let inventories = await Inventory.query().where('isDelete', false).fetch()

        return inventories
    }

    async create({request, response, auth}) {
        let inventory_param = request.all().inventory,
            inventory,
            old_state,
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

        new_state = JSON.stringify(inventory)

        dbloger.createRecord(old_state,new_state,user.id,'inventory',inventory.id)


        equipments_list = await Equipment.query().where('isDelete', false).where('department_id', inventory.department_id).fetch()

        dbloger.createRecord({},equipments_list.toJSON(),user.id,'inventoryItems',inventory.id)


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

        dbloger.createRecord(old_state, new_state, user.id, 'inventory',inventory.id)

        return response.json({status: '200', inventory:inventory})
    }
    async delete({params,request, response,auth}) {

        let inventory = await Inventory.findBy('id', params.id),
            old_state,
            new_state,
            user = await auth.getUser();

        old_state = JSON.stringify(inventory)
        inventory.isDelete = true

        await inventory.save()

        new_state = JSON.stringify(inventory)

        this.dbloger.createRecord(old_state,new_state,user.id,this.entity_name,inventory.id)


        return response.json({
            inventory:inventory,
            massage:'инвентаризация успешно удалена',
            status:'ok'
        })
    }

}

module.exports = InventoryController
