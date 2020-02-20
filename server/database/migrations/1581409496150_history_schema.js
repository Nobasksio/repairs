'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistorySchema extends Schema {
  up () {
    this.table('histories', (table) => {
        table.integer('entity_id').notNullable()
    })
  }

  down () {
    this.table('histories', (table) => {
      // reverse alternations
    })
  }
}

module.exports = HistorySchema
