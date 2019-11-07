<template>
    <v-app id="inspire">
        <v-content>
            <v-container
                    class="fill-height"
                    fluid
            >
                <v-row
                        align="center"
                        justify="center"
                >
                    <v-col
                            cols="12"
                            sm="8"
                            md="4"
                    >
                        <v-card class="elevation-12">
                            <v-toolbar
                                    color="red darken-1"
                                    dark
                                    flat
                            >
                                <v-toolbar-title>Вход в систему</v-toolbar-title>
                                <div class="flex-grow-1"></div>

                            </v-toolbar>
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                            label="Логин"
                                            name="login"
                                            v-model="emailLogin"
                                            @input="setEmailLogin"
                                            prepend-icon="person"
                                            type="text"
                                    ></v-text-field>

                                    <v-text-field
                                            id="password"
                                            label="Пароль"
                                            v-model="passwordLogin"
                                            @input="setPasswordLogin"
                                            name="password"
                                            prepend-icon="lock"
                                            type="password"
                                    ></v-text-field>
                                </v-form>
                                <v-alert
                                type="error"
                                :value="errorLogin"
                                >
                                    Неверный логин или пароль
                                </v-alert>
                            </v-card-text>
                            <v-card-actions>
                                <div class="flex-grow-1"></div>
                                <v-btn color="red darken-1 white-text" @click="login()">Войти</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>

    import { mapState, mapMutations, mapActions } from 'vuex';

    export default {
        name: "kazan-login",
        props: {
            source: String,
        },
        data: () => {
            return {
                show_error:false,
                loading:false,
                valid:false,
                user: {
                    email: null,
                    password: null,
                },

            }
        },
        methods:{
            ...mapMutations('auth', [
                'setEmailLogin','setPasswordLogin'
            ]),
            ...mapActions('auth',['login'])
        },
        computed:{
            ...mapState('auth',['emailLogin','passwordLogin','errorLogin'])
        }
    }
</script>

<style scoped >
.white-text{
    color:#ffffff;
}
</style >