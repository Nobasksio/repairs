'use strict'

const ClassEq = use('App/Models/ClassEq')

class ClassEqController {

    async create({request,response}){

        let class_eq_params = request.all().class_eq

        const class_eq = new ClassEq();

        class_eq.name = class_eq_params.name

        try {
            await class_eq.save()
            return response.json({ massage: 'всё ок', status:1})
        } catch (e) {
            console.log(e)
            return response.json({ massage: 'возникла ошибка при сохранении',status:0})
        }


    }


}

module.exports = ClassEqController
