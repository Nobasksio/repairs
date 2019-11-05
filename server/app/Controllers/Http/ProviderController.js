'use strict'

const Provider = use('App/Models/Provider')

class ProviderController {

    async provider({params, request, response}) {

        let provider = await Provider.findBy('id', params.id)


        return response.json({
            provider: provider,
        })
    }

    async create({request,response,auth}){

        let provider_params = request.all().provider,
            provider,
            old_state,
            dbloger = new Dbloger(),
            new_state,
            user = await auth.getUser();

        if (provider_params.id == null){
            provider = new Provider();

        } else {

            provider = await Provider.findBy('id', provider_params.id)

        }
        old_state = JSON.stringify(provider)


        provider.name = provider_params.name
        provider.inn = provider_params.inn
        provider.isDelete = false

        try {
            await provider.save()
            /*
             save new state and save history
            */
            new_state = JSON.stringify(provider)
            dbloger.createRecord(old_state,new_state,user.id,'provider')


            return response.json({ massage: 'всё ок', status:1,id:provider.id})
        } catch (e) {
            console.log(e)
            return response.json({ massage: 'возникла ошибка при сохранении',status:0})
        }
    }

    async delete({params,request, response,auth}) {

        let provider = await Provider.findBy('id', params.id),
            old_state,
            new_state,
            user = await auth.getUser(),
            dbloger = new Dbloger();

        old_state = JSON.stringify(provider)
        provider.isDelete = true

        await provider.save()

        new_state = JSON.stringify(provider)
        dbloger.createRecord(old_state,new_state,user.id,'provider')

        return response.json({
            provider:provider,
            massage:'поставщик успешно удален',
            status:'ok'
        })

    }
}

module.exports = ProviderController
