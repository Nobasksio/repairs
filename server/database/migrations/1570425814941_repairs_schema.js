'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepairsSchema extends Schema {
  up () {
    this.create('repairs', (table) => {
      table.increments()
        table.date('date_start')
        table.date('date_finish')
        table.integer('equipment_id')
        table.integer('provider_id')
        table.text('description')
        table.boolean('isWarranty')
        table.float('price')
      table.timestamps()
    })
  }

  down () {
    this.drop('repair')
  }
}

module.exports = RepairsSchema
