'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProviderSchema extends Schema {
  up () {
    this.table('providers', (table) => {
        table.boolean('isDelete').defaultTo(false)
    })
  }

  down () {
    this.table('providers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ProviderSchema
