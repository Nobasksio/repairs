'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransfersSchema extends Schema {
  up () {
    this.create('transfers', (table) => {
      table.increments()
        table.integer('from_dep_id')
        table.integer('to_dep_id')
        table.integer('equipment_id')
        table.integer('user_id')
        table.text('description')
        table.datetime('date_start')
        table.datetime('date_finish')
        table.boolean('isDelete').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('transfers')
  }
}

module.exports = TransfersSchema
