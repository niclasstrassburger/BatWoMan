<template>
    <v-menu location="bottom">
        <template v-slot:activator="{ props }">
            <div style="display: flex; align-items: center;">
              <v-img class="proteo-logo my-3" v-bind="props" src="@/assets/Logo_square_BatWoMan_transparent.png" 
            height="40" width="40" @click="redirectToWebsite" style="margin-right: 5%;" />
              <v-img class="proteo-logo my-3" v-bind="props" src="@/assets/logoCidetec.png" 
            height="30" width="30" @click="redirectToWebsiteCidetec" style="margin-right: 10%;" />
            </div>
        </template>
    </v-menu>
</template>

<script>
export default {
  name: 'ProteoAppLogo',
  methods: {
    redirectToWebsite() {
      window.open('https://batwoman.eu/', '_blank');
    },
    redirectToWebsiteCidetec() {
      window.open('https://cidetec.es/', '_blank');
    }
  }
}
</script>

<style scoped>
.proteo-logo {
    cursor: pointer;
    max-width: 150px;
    min-width: 150px;
    min-width: 40px;
    max-height: 40px;
}
</style>