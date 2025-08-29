/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import axios from './axios'
import pinia from '@/stores'
import router from '@/router'
import Vue3Tour from 'vue3-tour'

import 'vue3-tour/dist/vue3-tour.css'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(axios)
    .use(pinia)
    .use(router)
    .use(Vue3Tour)
}
