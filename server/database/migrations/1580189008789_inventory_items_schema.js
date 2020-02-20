'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InventoryItemsSchema extends Schema {
  up () {
    this.create('inventory_items', (table) => {
      table.increments()
        table.integer('inventory_id').notNullable()
        table.integer('equipment_id').notNullable()
        table.boolean('status').defaultTo(false)
        table.integer('cause').notNullable()
        table.boolean('isDelete').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('inventory_items')
  }
}

module.exports = InventoryItemsSchema
