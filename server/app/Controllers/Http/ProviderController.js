'use strict'

const Provider = use('App/Models/Provider')

class ProviderController {

    async provider({params, request, response}) {

        let provider = await Provider.findBy('id', params.id)


        return response.json({
            provider: provider,
        })
    }

    async create({request,response}){

        let provider_params = request.all().provider

        let provider
        if (provider_params.id == null){
            provider = new Provider();

        } else {

            provider = await Provider.findBy('id', provider_params.id)

        }


        provider.name = provider_params.name

        provider.inn = provider_params.inn
        provider.isDelete = false

        try {
            await provider.save()
            return response.json({ massage: 'всё ок', status:1,id:provider.id})
        } catch (e) {
            console.log(e)
            return response.json({ massage: 'возникла ошибка при сохранении',status:0})
        }
    }

    async delete({params,request, response}) {

        let provider = await Provider.findBy('id', params.id)

        provider.isDelete = true

        await provider.save()

        return response.json({
            provider:provider,
            massage:'поставщик успешно удален',
            status:'ok'
        })

    }
}

module.exports = ProviderController
