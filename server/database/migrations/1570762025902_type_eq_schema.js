'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TypeEqSchema extends Schema {
  up () {
    this.table('type_eqs', (table) => {
        table.boolean('isDelete').defaultTo(false)
    })
  }

  down () {
    this.table('type_eqs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TypeEqSchema
