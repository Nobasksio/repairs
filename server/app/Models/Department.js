'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Department extends Model {
    Equipment(){
        return this.hasMany('App/Models/Equipment')
    }
}

module.exports = Department
