'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepairSchema extends Schema {
  up () {
    this.table('repairs', (table) => {
        table.integer('department_id')
    })
  }

  down () {
    this.table('repairs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = RepairSchema
