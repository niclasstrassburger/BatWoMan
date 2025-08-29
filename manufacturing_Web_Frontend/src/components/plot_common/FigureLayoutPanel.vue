<template>
    <!-- Layout -->
    <v-card class="bg-surface fill-height px-3">
        <v-card-text>
            <v-row class="justify-start">
                <v-col cols="auto">
                    <v-row class="justify-start align-center">
                        <v-switch v-model="figSizeLayout.autosize" label="Autoresize" density="comfortable" />
                        <v-switch v-model="showGrid" label="Gridlines" @change="toggle_fig_grid"
                            density="comfortable" />
                    </v-row>
                    <v-row class="align-start mt-5">
                        <v-text-field v-model="figSizeLayout.width" label="Width" :disabled="figSizeLayout.autosize"
                            class="mr-2" :rules="[rules.maxmin, rules.required]" density="compact" />
                        <v-text-field v-model="figSizeLayout.height" label="Height" :disabled="figSizeLayout.autosize"
                            :rules="[rules.maxmin, rules.required]" density="compact" />
                    </v-row>
                </v-col>
                <v-col cols="auto" class="self-align-center">
                    <v-row class="justify-center">
                        <v-btn class="px-4" size="small" variant="outlined" @click="applyLimits">Update axes
                            limits</v-btn>
                    </v-row>
                    <!-- TODO: turn this into a for loop -->
                    <v-row class="justify-end align-center">
                        x
                        <v-text-field class="range-field ms-2" v-model="xAxisRange.lower" type="number"
                            :hide-spin-buttons="true" density="compact" :disabled="!setLimX" />
                        <v-text-field class="range-field" v-model="xAxisRange.upper" type="number"
                            :hide-spin-buttons="true" density="compact" :disabled="!setLimX" />
                        <v-checkbox v-model="setLimX" density="compact" />
                    </v-row>
                    <v-row class="justify-end align-center">
                        y
                        <v-text-field class="range-field ms-2" v-model="yAxisRange.lower" type="number"
                            :hide-spin-buttons="true" density="compact" :disabled="!setLimY" />
                        <v-text-field class="range-field" v-model="yAxisRange.upper" type="number"
                            :hide-spin-buttons="true" density="compact" :disabled="!setLimY" />
                        <v-checkbox v-model="setLimY" density="compact" />
                    </v-row>
                    <v-row v-show="hasY2" class="justify-end align-center">
                        y2
                        <v-text-field class="range-field ms-2" v-model="yAxis2Range.lower" type="number"
                            :hide-spin-buttons="true" density="compact" :disabled="!setLimY2" />
                        <v-text-field class="range-field" v-model="yAxis2Range.upper" type="number"
                            :hide-spin-buttons="true" density="compact" :disabled="!setLimY2" />
                        <v-checkbox v-model="setLimY2" density="compact" />
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        "layout": {
            type: Object,
            default: () => { return {} }
        },
        hasY2: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:layout'],
    data() {
        return {
            figSizeLayout: {
                autosize: true,
                width: '800',
                height: '500',
            },
            showGrid: false,
            setLimX: true,
            setLimY: true,
            setLimY2: true,
            xAxisRange: {
                lower: 0,
                upper: 20,
            },
            yAxisRange: {
                lower: 0,
                upper: 4.5,
            },
            yAxis2Range: {
                lower: 0,
                upper: 4.5,
            },
            rules: {
                maxmin: value => parseInt(value) >= 300 || 'Min value is 300 px.',
                required: value => !!value || 'Field is required',
            },
        };
    },
    computed: {
        // xLabel() {
        //     return this.layout.xaxis.title.text
        // }
    },
    methods: {
        toggle_fig_grid() {
            const newLayoutOptions = { ...this.layout }
            newLayoutOptions.xaxis.showgrid = this.showGrid
            newLayoutOptions.yaxis.showgrid = this.showGrid
            this.$emit('update:layout', newLayoutOptions)
        },
        applyLimits() {
            const newLayoutOptions = JSON.parse(JSON.stringify(this.layout))
            if (this.setLimX) {
                newLayoutOptions.xaxis.range = [...Object.values(this.xAxisRange).map(val => parseFloat(val))]
                newLayoutOptions.xaxis.autorange = false
            } else newLayoutOptions.xaxis.autorange = true
            if (this.setLimY) {
                newLayoutOptions.yaxis.range = [...Object.values(this.yAxisRange).map(val => parseFloat(val))]
                newLayoutOptions.yaxis.autorange = false
            } else newLayoutOptions.yaxis.autorange = true
            if (this.setLimY2) {
                newLayoutOptions.yaxis2.range = [...Object.values(this.yAxis2Range).map(val => parseFloat(val))]
                newLayoutOptions.yaxis2.autorange = false
            } else newLayoutOptions.yaxis2.autorange = true
            this.$emit('update:layout', newLayoutOptions)
        }
    },
    watch: {
        figSizeLayout: {
            handler() {
                const newLayoutOptions = { ...this.layout, ...this.figSizeLayout }
                if (this.figSizeLayout.autosize) {
                    delete newLayoutOptions.width
                    delete newLayoutOptions.height
                }
                this.$emit('update:layout', newLayoutOptions)
            },
            deep: true
        },
    },
    mounted() {
        // this.figSizeLayout.autosize = true // TODO: this forces the size, see why size does not change normally
    }
};
</script>

<style scoped>
.header-text {
    font-weight: bold;
}

.v-switch {
    min-width: 150px;
    margin-right: 0.5rem;
}

.v-text-field {
    max-width: 100px;
    min-width: 80px;
}

.range-field {
    max-width: 80px;
    padding: 0 0 !important;
}
</style>