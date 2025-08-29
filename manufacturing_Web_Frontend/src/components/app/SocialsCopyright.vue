<template> 
    <a v-for="item in links" :key="item.title" :href="item.href" :title="item.title"
        class="d-inline-block mx-2 social-link" rel="noopener noreferrer" target="_blank">
        <v-icon :icon="item.icon" :size="item.icon === '$vuetify' ? 24 : 16" />
    </a>
    <div class="text-caption text-disabled ml-2">
        &copy; 2022-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">CIDETEC</span>
    </div>
</template>


<script setup>

const links = [
    {
        title: 'BatWoMan website',
        icon: `mdi-bat`,
        href: 'https://batwoman.eu/',
    },
    {
        title: 'CIDETEC website',
        icon: `mdi-web`,
        href: 'https://www.cidetec.es/',
    },
    {
        title: 'CIDETEC contact',
        icon: 'mdi-email-outline',
        href: 'mailto:cidetec@cidetec.es',
    },
    {
        title: 'CIDETEC GitHub',
        icon: `mdi-github`,
        href: 'https://github.com/cidetec-energy-storage/',
    },
]
</script>

<style scoped>
.social-link :deep(.v-icon) {
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
    text-decoration: none;
    transition: 0.2s ease-in-out;
}

.social-link :deep(.v-icon):hover {
    color: rgba(25, 118, 210, 1);
}
</style>