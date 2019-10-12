'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartmentSchema extends Schema {
  up () {
    this.table('departments', (table) => {
        table.boolean('isDelete').defaultTo(false)
    })
  }

  down () {
    this.table('departments', (table) => {
      // reverse alternations
    })
  }
}

module.exports = DepartmentSchema
