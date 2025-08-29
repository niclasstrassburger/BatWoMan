<template>
  <v-container class="fill-height" fluid>
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <div class="text-center">
        <div class="text-h3 font-weight-bold mb-n1">Welcome to</div>
        <v-img class="my-4 ms-12" height="80" src="@/assets/Logo_square_BatWoMan_transparent.png" />
      </div>

      <div class="py-2" />

      <v-row>
        <v-col cols="12">
          <v-card class="py-4" color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline" rounded="lg" variant="outlined">
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">Get started</h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Go to the characterization page and search for your tests
              </div>
            </template>

            <v-overlay opacity=".12" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card append-icon="mdi-open-in-new" class="py-4" color="surface-variant" prepend-icon="mdi-text-box-outline"
            rel="noopener noreferrer" rounded="lg" subtitle="Learn about all things this library (coming soon)."
            target="_blank" title="Documentation" variant="text">
            <v-overlay opacity=".06" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>
        <!-- <a href="file:///intranet/datos/Comun/Proteo">Open PDF</a> -->
        <v-col cols="6">
          <v-card append-icon="mdi-open-in-new" class="py-4" color="surface-variant"
            href="file:////intranet/datos/Comun/Proteo/test_file.txt" prepend-icon="mdi-star-circle-outline"
            rel="noopener noreferrer" rounded="lg" subtitle="Check the latest presentation with main features."
            target="_blank" title="Features" variant="text">
            <v-overlay opacity=".06" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card append-icon="mdi-open-in-new" class="py-4" color="surface-variant" href="https://www.cidetec.es"
            prepend-icon="mdi-widgets-outline" rel="noopener noreferrer" rounded="lg"
            subtitle="Discover other computational tools." target="_blank" title="Proteo portfolio" variant="text">
            <v-overlay opacity=".06" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card append-icon="mdi-email-fast" class="py-4" color="surface-variant" href="mailto:ddelolmo@cidetec.es"
            prepend-icon="mdi-account-group-outline" rel="noopener noreferrer" rounded="lg"
            subtitle="Any other questions or problems? Drop an email!" target="_blank" title="Contact" variant="text">
            <v-overlay opacity=".06" scrim="primary" contained model-value persistent />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
export default {
  methods: {
    goToRoute(routePath) {
      if (this.$router.currentRoute.path !== routePath) {
        this.$router.push(routePath);
      }
    },
  }
}
</script>

