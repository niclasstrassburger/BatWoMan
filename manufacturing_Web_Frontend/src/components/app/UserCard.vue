<template>
    <v-card class="mx-2 my-3 px-2 py-2" variant="outlined" >
        <v-row class="align-center" dense>
            <v-col cols="auto">
                <span class="text-body-2"><b>{{ username }}</b></span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <v-menu v-model="menu" location="bottom" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon flat density="compact" style="background-color: #d4e7d4;">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list slim class="ma-0 pa-0">
                        <!-- <v-list-item class="mx-0 pa-0 mb-n2" density="comfortable">
                            <v-btn size="small" @click="toggleTheme()" block>
                                Toggle theme
                                <v-icon class="ms-2">{{ iconDarkLight }}</v-icon>
                            </v-btn>
                        </v-list-item>
                        <v-list-item class="ma-0 pa-0 mt-n2" v-if="isLoggedIn" density="comfortable">
                            <v-btn size="small" @click="userPerfDialog = true; menu = false" block>
                                Preferences
                                <v-icon class="ms-2">mdi-account-cog</v-icon>
                            </v-btn>
                        </v-list-item> -->
                        <v-list-item class="ma-0 pa-0 mt-n2" v-if="isLoggedIn" density="comfortable">
                            <v-btn size="small" @click="closeSesion" block>
                                Close Session
                                <v-icon class="ms-2">mdi-logout</v-icon>
                            </v-btn>
                        </v-list-item>
                        <v-list-item class="ma-0 pa-0" v-else>
                            <v-btn size="small" @click="goToLogin()" block>
                                Log in
                                <v-icon class="ms-2">mdi-login</v-icon>
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
        </v-row>
    </v-card>
    <!-- <UserPreferences v-if="userPerfDialog" v-model:parentDialog="userPerfDialog" /> -->
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useAppStore } from '@/stores/app';

export default {
    components: {},
    data() {
        return {
            menu: false,
            // userPerfDialog: false,
            // iconDarkLight: 'mdi-white-balance-sunny'
        }
    },
    computed: {
        ...mapState(useAppStore, {
            username: 'getUsername',
            isLoggedIn: 'isLoggedIn'
        }),
    },
    methods: {
        ...mapActions(useAppStore, ['updateUser']),
        goToRoute(routePath) {
            if (this.$router.currentRoute.path !== routePath) {
                this.$router.push(routePath);
            }
        },
        // toggleTheme() {
        //     this.iconDarkLight = this.$vuetify.theme.global.current.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
        //     this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark ? 'light' : 'dark'
        // },
        closeSesion() {
            this.menu = false
            // this.logOut()
            localStorage.removeItem('token')
            localStorage.removeItem('groups')
            localStorage.removeItem('username')
            this.updateUser()
            this.$router.push('/login')
        },
        goToLogin() {
            this.menu = false
            this.goToRoute('/login')
        },
    },
    // mounted() {
    //     this.iconDarkLight = this.$vuetify.theme.global.current.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
    //     this.fetchUserPreferences()
    // }
}
</script>

<style scoped>
.v-list-item {
    padding: 0px;
    margin: 0px;
}
</style>