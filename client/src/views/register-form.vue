<template >
    <div >

        <h1 class="display-1" >Поздание нового пользователя</h1 >
        <v-form v-model="valid" >

            <v-container class="px-4 py-4 align-self-start ml-0" >
                <v-row >
                    <v-col cols="4" class="pb-0" >
                        <v-text-field
                                v-model="user.name"
                                label="Имя Фамилия"
                                placeholder="Иванов Иван"
                                outlined
                                class="mr-2 mb-0"
                                :rules="[rules.required, rules.min]"
                        >
                        </v-text-field >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="4" class="pb-0" >
                        <v-text-field
                                v-model="user.email"
                                label="Email"
                                placeholder="ivan@mail.ru"
                                outlined
                                class="mr-2 mb-0"
                                :rules="[rules.required, rules.min]"
                        >
                        </v-text-field >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="4" class="pb-0" >
                        <v-text-field
                                v-model="user.password"
                                label="Пароль"
                                :type="show1 ? 'text' : 'password'"
                                outlined
                                class="mr-2 mb-0"
                                @click:append="show1 = !show1"
                                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                        >
                        </v-text-field >
                    </v-col >
                    <v-col cols="4" class="pb-0" >
                        <v-text-field
                                v-model="user.password2"
                                label="Пароль ещё раз"
                                :type="show2 ? 'text' : 'password'"
                                outlined
                                class="mr-2 mb-0"
                                :rules="pass2"
                                @click:append="show2 = !show2"
                                :append-icon="show2 ? 'visibility' : 'visibility_off'"
                        >
                        </v-text-field >
                    </v-col >
                </v-row >
                <v-row >
                    <v-col cols="4" >
                        <v-btn color="primary" class="m-2"
                               :loading="loading"
                               :disabled="loading || !valid"
                               large @click="create_user()" >Создать
                        </v-btn >
                    </v-col >
                </v-row >
            </v-container >
        </v-form >
    </div >
</template >


<script >
    const axios = require('axios');
    import HTTTP from '../http';
    export default {
        name: "register-form",
        data: () => {
            return {
                valid:false,
                show1: false,
                show2: false,
                loading:false,
                pass2:[
                    v => v != user.password || 'Пароли не совпадают'
                ],
                user: {
                    name: null,
                    email: null,
                    password: null,
                    password2: null
                },
                rules: {
                    required: value => !!value || 'Поле не может быть пустым',
                    min: v => v.length >= 3 || 'В названии не может быть меньше 3 символов',
                },
            }
        },
        methods:{
            create_user() {

                HTTTP().post('/register',
                    {user: this.user}
                ).then((response) => {
                    this.loading = false
                    this.succ_alert = true

                    this.name_button = 'сохранить'
                })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false
                        this.error_alert = true
                    });
            },
        }
    }
</script >

<style scoped >

</style >