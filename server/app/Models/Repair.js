'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Repair extends Model {

    Equipment(){
        return this.belongsTo('App/Models/Equipment')
    }

}

module.exports = Repair
