'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Inventory extends Model {
    Equipments(){
        return this
            .belongsToMany('App/Models/Equipment')
            .pivotTable('inventory_items')
    }
    InventoryItems(){
        return this
            .hasMany('App/Models/InventoryItems')
    }
}

module.exports = Inventory
