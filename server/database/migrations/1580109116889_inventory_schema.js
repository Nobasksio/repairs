'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InventorySchema extends Schema {
  up () {
    this.create('inventories', (table) => {
      table.date('date_plan')
        table.integer('department_id').notNullable()
        table.integer('user_create_id').notNullable()
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('inventories')
  }
}

module.exports = InventorySchema
