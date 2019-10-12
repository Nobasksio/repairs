'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipmentSchema extends Schema {
  up () {
    this.table('equipment', (table) => {
        table.integer('class_eq_id')
        table.integer('type_eq_id')
    })
  }

  down () {
    this.table('equipment', (table) => {
      // reverse alternations
    })
  }
}

module.exports = EquipmentSchema
