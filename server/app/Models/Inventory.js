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
    department() {
        return this.belongsTo('App/Models/Department', 'department_id', 'id')
    }
}

module.exports = Inventory
