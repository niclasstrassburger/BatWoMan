<template>
    <v-container fluid>
        <!-- <v-select v-model="project" :items="projects" /> -->
        <BaseProjectDashboard :projectId="project" :extraExcludedHeaders="['Clientname']">
            <template v-slot:project-title>
                BatWoman
            </template>
            <template v-slot:title-project-info>
                <TaskCard v-if="this.order" :nTests="nTests" :nRunning="nRunning" />
            </template>
            <template v-slot:cell-actions>
            </template>
        </BaseProjectDashboard>
        <TemplateCard name="Test" :owner="null" :template="{}"></TemplateCard>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useKPIStore } from '@/stores/kpi'

export default {
    name: 'DashboardView',
    data() {
        return {
            project: 2,
            selectedCells: [],
        };
    },
    computed: {
        ...mapState(useKPIStore, ['order', 'nTests', 'nRunning'])
    },
    methods: {
    },
    watch: {},
}
</script>

<style scoped></style>