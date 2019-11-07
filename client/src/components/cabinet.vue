<template >
    <div >

        <v-navigation-drawer app v-model="drawer" class="d-print-none" id="drawer-left">
            <v-list-item >
                <v-list-item-content >
                    <v-list-item-title class="title" >
                        Repairs 19
                    </v-list-item-title >
                    <v-list-item-subtitle >

                    </v-list-item-subtitle >
                </v-list-item-content >
            </v-list-item >

            <v-divider ></v-divider >

            <v-list
                    dense
                    nav
            >
                <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        link
                        :to="item.route"
                >
                    <v-list-item-icon >
                        <v-icon v-text="item.icon"></v-icon>

                    </v-list-item-icon >

                    <v-list-item-content >
                        <v-list-item-title >{{ item.title }}</v-list-item-title >
                    </v-list-item-content >
                </v-list-item >
            </v-list >
            <v-col cols="4" >
                <v-btn color="primary" class="px-10"  @click="logout" >Выход</v-btn >
            </v-col >
        </v-navigation-drawer >

        <v-app-bar app class="d-print-none">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <!-- -->
        </v-app-bar >

        <!-- Sizes your content based upon application components -->
        <v-content id="content-main">

            <!-- Provides the application the proper gutter -->
            <v-container fluid >

                <!-- If using vue-router -->
                <router-view >

                </router-view >
            </v-container >
        </v-content >

        <v-footer app class="d-print-none">
            <!-- -->
        </v-footer >
    </div >
</template >

<script >
    import { mapGetters, mapActions, mapState} from 'vuex';
    import router from '../router'
    import store from '../store/index'
    export default {
        name: "cabinet",
        data: () => ({
            drawer: null,
            items: [
                {
                    title: 'Оборудование',
                    icon: 'local_laundry_service',
                    route:'/'
                },
                {
                    title: "Добавить оборудование",
                    icon: '',
                    route:'/equipment/create'
                },
                {
                    title: "Ремонт",
                    icon: 'mdi-auto-fix',
                    route:'/repair'
                },
                {
                    title: "Создать ремонт",
                    icon: '',
                    route:'/repair/create/'
                },
                {
                    title: "Перемещения",
                    icon: 'mdi-transfer',
                    route:'/transfer'
                },
                {
                    title: "Создать перемещение",
                    icon: '',
                    route:'/transfer/create/'
                },
                {
                    title: "Настройки",
                    icon: 'settings_applications',
                    route:'/settings'
                },


            ]
        }),
        mounted:function(){


            if (this.$store.state.auth.tokenLogin == null){
                router.push('/login')
            }

        },
        computed:{
            ...mapGetters('auth',['isLoggedIn'])
        },
        methods:{
            ...mapActions('auth',['logout']),
            exit() {
                delete localStorage.token;
                this.$router.push('/login')
            }
        }
    }
</script >

<style scoped >
    @media print {
        #drawer-left {
            display:none;
        }

        #content-main {
            display: block;
            margin: 0;
            float: none;
        }
    }
</style >