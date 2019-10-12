'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipmentSchema extends Schema {
  up () {
    this.create('equipment', (table) => {
      table.increments('id')
        table.string('name',255)
        table.text('description')
        table.string('out_number')
        table.string('in_number')
        table.string('in_number_uniq',40).unique()
        table.date('date_buy')
        table.date('warranty')
        table.uuid('uuid')
        table.integer('price')
        table.timestamps()
    })
  }

  down () {
    this.drop('equipment')
  }
}

module.exports = EquipmentSchema
