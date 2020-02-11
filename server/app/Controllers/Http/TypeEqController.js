'use strict'

const TypeEq = use('App/Models/TypeEq')
const Dbloger = use('App/Helpers/dbloger.js')

class TypeEqController {

    async group({params, request, response}) {
        let group = await TypeEq.findBy('id', params.id)


        return response.json({
            group: group,
        })
    }

    async create({request,response,auth}){

        let type_eq_params = request.all().group,
            group,
            old_state,
            new_state,
            dbloger = new Dbloger(),
            user = await auth.getUser();


        if (type_eq_params.id == null){

            group = new TypeEq();

        } else {

            group = await TypeEq.findBy('id', type_eq_params.id)

        }
        old_state = JSON.stringify(group)

        group.name = type_eq_params.name
        group.isDelete = false

        try {
            await group.save()

            /*
               save new state and save history
            */
            new_state = JSON.stringify(group)
            dbloger.createRecord(old_state,new_state,user.id,'group',group.id)

            return response.json({ massage: 'всё ок', status:1})
        } catch (e) {
            console.log(e)
            return response.json({ massage: 'возникла ошибка при сохранении',status:0})
        }
    }
    async delete({params,request, response,auth}) {

        let group = await TypeEq.findBy('id', params.id),
            old_state,
            new_state,
            user = await auth.getUser(),
            dbloger = new Dbloger();

        old_state = JSON.stringify(group)
        group.isDelete = true

        await group.save()

        new_state = JSON.stringify(group)
        dbloger.createRecord(old_state,new_state,user.id,'group',group.id)

        return response.json({
            group:group,
            massage:'группа успешно удалена',
            status:'ok'
        })

    }
}

module.exports = TypeEqController
