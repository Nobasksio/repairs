'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipmentSchema extends Schema {
  up () {
    this.table('equipment', (table) => {
        table.boolean('isWarranty')
    })
  }

  down () {
    this.table('equipment', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EquipmentSchema
