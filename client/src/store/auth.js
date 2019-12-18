import router from '../router'
import HTTTP from '../http';



export default {
    namespaced:true,
    state:{
        emailLogin:null,
        passwordLogin:null,
        nameLogin:null,
        tokenLogin:null,
        errorLogin:false
    },
    actions:{
        logout({commit}){
            commit('setToken', null)
            commit('setEmailLogin', null)
            commit('setPasswordLogin', null)
            commit('setNameLogin', null)
            commit('setErrorLogin', false)
            router.push('/login')
        },
         login({commit, state }){
            return HTTTP().post('/login',{
                email: state.emailLogin,
                password: state.passwordLogin
            }).then(({data})=>{
                commit('setToken', data.token)
                commit('setNameLogin', data.name)
                router.push('/')
            }).catch(function (error) {
                commit('setErrorLogin', true)
            })
        }
    },
    getters:{
        isLoggedIn(state){
            return !!state.token;
        }
    },
    mutations:{
        setEmailLogin(state,email){
            state.emailLogin = email
        },
        setPasswordLogin(state,password){
            state.passwordLogin = password
        },
        setNameLogin(state,name){
            state.nameLogin = name
        },
        setToken(state,token){
            state.tokenLogin = token
        },
        setErrorLogin(state,error){
            state.errorLogin = error
        }

    }
}