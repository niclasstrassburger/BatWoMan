<template>
    <v-navigation-drawer v-model="openDrawer" width="180" 
        style="background-color: #d4e7d4;">
        <ProteoAppLogo />
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-list nav>
            <v-list-item title="Homepage" 
                @click="$router.push({ path: '/ManufacturingHomepage' })"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Coating & Drying" 
                @click="$router.push({ path: '/manufacturingCoating' })"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Calendering"  
                @click="$router.push({ path: '/ManufacturingCalendering' })"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Wetting" 
                @click="$router.push({ path: '/ManufacturingWetting' })"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Drying" 
                @click="$router.push({ path: '/ManufacturingDrying' })"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Performance" 
                @click="$router.push({ path: '/ManufacturingPerformance' })"></v-list-item>
            <v-divider></v-divider>
            <v-divider></v-divider>
            <v-divider></v-divider>
        </v-list>

        
        <template v-slot:append>
            <!-- <v-container class="d-flex justify-center">
                <v-img src="@/assets/logoCidetec.png" contain max-width="100" max-height="100"/>
            </v-container> -->
            <UserCard />
            <SocialsCopyright />
        </template>
    </v-navigation-drawer>
    <v-dialog v-model="confirmationMenu" width="auto">
        <v-card max-width="400" prepend-icon="mdi-table-remove"
            :text="`Going to ${nextRouteName} will clear all loaded data and graphs in the current window.`"
            title="Clear all data?">
            <template v-slot:actions>
                <v-row class="justify-end" no-gutters>
                    <v-col cols="auto">
                        <v-btn class="bg-error" text="Cancel" @click="confirmationMenu = false" />
                    </v-col>
                    <v-col cols="auto">
                        <v-btn class="ms-5 bg-primary" text="Ok" @click="resetView" />
                    </v-col>
                </v-row>
            </template>
        </v-card>
    </v-dialog>
</template>


<script>
import { useDisplay } from 'vuetify';
import { mapState, mapActions } from 'pinia'
import { useAppStore } from '@/stores/app'
// import { useCyclerStore } from '@/stores/cycler'
// import { usePlotStore } from '@/stores/plot'

export default {
    name: 'AppNavBar',
    components: {},
    setup() {
        const { smAndDown, mdAndUp } = useDisplay()
        return { smAndDown, mdAndUp }
    },
    data() {
        return {
            openDrawer: true,
            open: ['char'],
            confirmationMenu: false,
            confirmationMenuAttach: null,
            listValue: '',
            // routes: [
            //     { title: "Characterization", path: '/characterization' },
            //     { title: "EIS Analysis", path: '/eis', disabled: true },
            //     { title: "Dashboards", path: '/dashboard' },
            // ],
            nextRoute: null,
        }
    },
    computed: {
        ...mapState(useAppStore, {
            navDrawer: 'navDrawer',
            isLoggedIn: 'isLoggedIn',
            viewDashboard: 'hasDashboards',
            // tabs: 'characterizationTabs',
            activeTab: 'activeTab',
            openCyclerTabs: 'openCyclerTabs',
        }),
        // ...mapState(useCyclerStore, ['nTests']),
        nextRouteName() {
            if (!this.nextRoute) return null
            return this.routes.find(r => r.path === this.nextRoute.path)?.title
        }
    },
    watch: {
        openCyclerTabs(newVal) {
            if (!newVal) this.open = []
            // this.open = newVal ? ['char'] : []
        },
        openDrawer(newVal) {
            this.updateNavDrawer(newVal)
        },
        navDrawer(newVal) {
            this.openDrawer = newVal
        },
        smAndDown(newVal) {
            if (newVal) this.openDrawer = false
        }
    },
    methods: {
        ...mapActions(useAppStore, ['updateActiveTab', 'resetTabs', 'updateNavDrawer']),
        // ...mapActions(useCyclerStore, ['clearTests']),
        // ...mapActions(usePlotStore, ['clearStore']),
        goToRoute(route) {
            if (this.nTests > 0) {
                this.confirmationMenu = true
                this.nextRoute = route
                return
            }
            this.$router.push(route)
            this.nextRoute = null
        },
        resetView() {
            this.clearTests()
            this.updateActiveTab(0)
            this.resetTabs()
            this.clearStore()
            this.confirmationMenu = false
            this.$router.push(this.nextRoute)
            this.nextRoute = null
        }
    },
    mounted() {
    }
}
</script>

<style scoped>
.v-list-item--density-compact.v-list-item--one-line {
    min-height: 32px;
}

.v-list .v-list-item--nav:not(:only-child) {
    margin-bottom: 2px;
}
</style>