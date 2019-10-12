'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TypeEqSchema extends Schema {
  up () {
    this.create('type_eqs', (table) => {
      table.increments()
        table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('type_eqs')
  }
}

module.exports = TypeEqSchema
