'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Equipment extends Model {
    Department(){
        return this.belongsTo('App/Models/Department')
    }
    TypeEq(){
        return this.belongsTo('App/Models/TypeEq')
    }
    Repairs(){
        return this.hasMany('App/Models/Repair')
    }
    Photos(){
        return this.hasMany('App/Models/Photo','id','entity_id')
    }
    Transfers(){
        return this.hasMany('App/Models/Transfer')
    }

}

module.exports = Equipment
