'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepairsSchema extends Schema {
  up () {
    this.table('repairs', (table) => {
        table.boolean('isDelete').defaultTo(false)
    })
  }

  down () {
    this.table('repairs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = RepairsSchema
