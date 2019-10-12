'use strict'

const TypeEq = use('App/Models/TypeEq')

class TypeEqController {

    async group({params, request, response}) {
        let group = await TypeEq.findBy('id', params.id)


        return response.json({
            group: group,
        })
    }

    async create({request,response}){

        let type_eq_params = request.all().group

        let group = {}

        if (type_eq_params.id == null){
            group = new TypeEq();

        } else {

            group = await TypeEq.findBy('id', type_eq_params.id)

        }

        group.name = type_eq_params.name
        group.isDelete = false

        try {
            await group.save()
            return response.json({ massage: 'всё ок', status:1})
        } catch (e) {
            console.log(e)
            return response.json({ massage: 'возникла ошибка при сохранении',status:0})
        }
    }
    async delete({params,request, response}) {

        let group = await TypeEq.findBy('id', params.id)

        group.isDelete = true

        await group.save()

        return response.json({
            group:group,
            massage:'группа успешно удалена',
            status:'ok'
        })

    }
}

module.exports = TypeEqController
