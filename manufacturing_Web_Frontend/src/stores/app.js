// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    username: localStorage.username,
    userId: localStorage.user_id,
    userGroups: localStorage.groups,
    navDrawer: true,
    // characterizationTabs: {
    //   'explorer': false,
    //   'info': true,
    //   'plot': true,
    //   'reports': true,
    //   'gitt': true,
    //   // 'balancing': true,
    // },
    activeTab: 0,
    openCyclerTabs: null,
    userDefaults: {
      plot: { legend: { showStep: true, textSize: 14 } },
      cell: { area: 1 },
    },
    userPreferences: null,
    //
  }),
  getters: {
    getUsername() {
      return this.username ? this.username : 'guest'
    },
    isLoggedIn() {
      return Boolean(this.username)
    },
    maxTests() {
      return this.username ? 24 : 12
    },
    hasDashboards() {
      return this.username && this.userGroups && this.userGroups.includes('NT')
    },
  },
  actions: {
    updateUser() {
      this.username = localStorage.username
      this.userId = localStorage.user_id
      this.userGroups = localStorage.groups
      // this.fetchUserPreferences()
    },
    // updateTabs(tabs) {
    //   this.characterizationTabs = { ...this.characterizationTabs, ...tabs }
    // },
    updateActiveTab(newActiveTab) {
      this.activeTab = newActiveTab
    },
    // resetTabs() {
    //   Object.keys(this.characterizationTabs).forEach(tab => { if (tab != 'explorer') { this.characterizationTabs[tab] = true } })
    // },
    updateOpenCyclerTabs(isRouteCycler) {
      this.openCyclerTabs = isRouteCycler
    },
    fetchUserPreferences() {
      if (!this.isLoggedIn) this.setDefaultUserPreferences()
      else this.$axiosProteoDA.get('user_preferences/')
        .then(res => {
          this.userPreferences = res.data // Actually do a deep merge or this will be ducked
          if (!this.userPreferences.plot) this.userPreferences.plot = JSON.parse(JSON.stringify(this.userDefaults.plot))
          if (!this.userPreferences.cell) this.userPreferences.cell = JSON.parse(JSON.stringify(this.userDefaults.cell))
        }).catch(e => {
          console.log(e)
          this.setDefaultUserPreferences()
        }
        )
    },
    updateUserPreferences(newPreferences) {
      this.userPreferences = newPreferences
      this.$axiosProteoDA.put('user_preferences/', this.userPreferences).then().catch(e => console.log(e))
    },
    setDefaultUserPreferences() {
      this.userPreferences = JSON.parse(JSON.stringify(this.userDefaults))
    },
    updateNavDrawer(newVal) {
      this.navDrawer = newVal
    },
    isAuthenticated(){
      console.log(this.username, Boolean(this.username))
      return Boolean(this.username)
    }
  }
})
