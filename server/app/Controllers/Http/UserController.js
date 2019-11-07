'use strict'

const User = use('App/Models/User')

class UserController {

    async login({request,auth}){
        const register_param = request.all();
        let { email,password  } = register_param
        const token = await auth.attempt(email,password);

        return token;

    }

    async register({request}) {

        const register_param = request.all();
        let email = register_param.user.email
        let password = register_param.user.password
        let name = register_param.user.name


        const user = await  User.create({
            email,
            password,
            username:email
        })

        return user
    }

}

module.exports = UserController
