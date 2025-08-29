<template>
  <v-app>
    <AppNavBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
    }
  },
  methods: {}
}
</script>
<style>
html {
  overflow-y: auto !important
}
</style>