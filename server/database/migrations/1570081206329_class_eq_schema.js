'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClassEqSchema extends Schema {
  up () {
    this.create('class_eqs', (table) => {
      table.increments()
        table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('class_eqs')
  }
}

module.exports = ClassEqSchema
