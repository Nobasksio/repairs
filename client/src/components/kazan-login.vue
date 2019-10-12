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
                                            v-model="user.email"
                                            prepend-icon="person"
                                            type="text"
                                    ></v-text-field>

                                    <v-text-field
                                            id="password"
                                            label="Пароль"
                                            v-model="user.password"
                                            name="password"
                                            prepend-icon="lock"
                                            type="password"
                                    ></v-text-field>
                                </v-form>
                                <v-alert
                                type="error"
                                v-show="show_error"
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
    const axios = require('axios');
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
            login() {

                axios.post('/api/login',
                    {user: this.user}
                ).then((response) => {
                    this.loading = false
                    this.succ_alert = true
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('email', this.user.email);
                    this.$router.push('/')
                })
                    .catch((error) => {
                        console.log(error);
                        this.loading = false
                        this.show_error = true

                    });
            },
        }
    }
</script>

<style scoped >
.white-text{
    color:#ffffff;
}
</style >