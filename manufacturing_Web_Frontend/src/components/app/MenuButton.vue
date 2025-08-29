<template>
    <v-icon class="menu-buttom" icon="mdi-menu" @click="updateNavDrawer(true)" />
</template>

<script>
import { mapActions } from 'pinia'
import { useAppStore } from '@/stores/app';

export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions(useAppStore, ['updateNavDrawer']),
  }
  }
</script>

<style>
.menu-buttom {
    cursor: pointer;
}
</style>