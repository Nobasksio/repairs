'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InvenoriesSchema extends Schema {
  up () {
    this.table('inventories', (table) => {
        table.boolean('isDelete').defaultTo(false)
        table.boolean('isClose').defaultTo(false)
    })
  }

  down () {
    this.table('inventories', (table) => {
      // reverse alternations
    })
  }
}

module.exports = InvenoriesSchema
