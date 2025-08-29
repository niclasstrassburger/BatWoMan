/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
// import colors from 'vuetify/util/colors';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'secondarybg': "#FFFFFF",
          'greenbg': "#cafff0",
          'bluebtn': "#cbe0f8",
          // 'on-surface-variant': colors.grey.lighten6,
        },
      },
      dark: {
        colors: {
          'secondarybg': "#505050",
          'greenbg': "#1d735a",
          'bluebtn': "#0a294d",
          // 'on-surface-variant': colors.grey.lighten6,
        },
      },
    },
  },
  defaults: {
    VSelect: {
      hideDetails: 'auto',
      density: 'comfortable',
      variant: 'outlined',
    },
    VAutocomplete: {
      hideDetails: 'auto',
      density: 'comfortable',
      variant: 'outlined',
    },
    VTextField: {
      hideDetails: 'auto',
      density: 'comfortable',
      variant: 'outlined',
    },
    VSwitch: {
      hideDetails: true,
      density: 'comfortable',
    },
    VCheckbox: {
      hideDetails: true,
    },
    VSlider: {
      hideDetails: true,
      thumbLabel: true,
    },
    VColorPicker: {
      VSlider: {
        thumbLabel: false,
      }
    },
    VCard: {
      VAutocomplete: {
        variant: 'outlined',
        autoSelectFirst: true,
        density: 'comfortable',
        hideDetails: 'auto',
      }
    },

  },
})
