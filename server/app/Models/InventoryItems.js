'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class InventoryItems extends Model {
    Equipments(){
        return this
            .hasOne('App/Models/Equipment')

    }
}

module.exports = InventoryItems
