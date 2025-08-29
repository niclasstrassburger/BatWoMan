<template>
    <v-card class="pa-3" min-width="400px">
        <v-card-title class="bg-greenbg">
            <v-row align="center">
                <v-col cols="auto">
                    Line properties
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                    <v-btn color="red" @click="$emit('close-menu')">Close</v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="bg-secondarybg mt-3">
            <v-row>
                <v-col cols="auto">
                    <v-select v-model="selectedTrace" :items="traceNames" item-value="id" item-title="name" label="Line"
                        width="350px" density="compact" />
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col cols="auto">
                    <v-row no-gutters>
                        <v-col>
                            <v-select class="style-selector" v-model="plotMode" :items="modeOptions" label="Line style"
                                density="compact" :disabled="isFill" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-select class="style-selector" v-model="markerProperties.symbol" :items="markerSymbols"
                                label="Marker" :disabled="!plotMode.includes('marker')" density="compact" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-select class="style-selector" v-model="markerStyle" label="Marker style"
                                :items="markerStyles" :disabled="!plotMode.includes('marker')" density="compact" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row align="center" no-gutters>
                                <v-col cols="auto">
                                    Line width
                                </v-col>
                                <v-spacer />
                                <v-col cols="auto">
                                    <v-tooltip location="top" text="Apply width to all lines">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" @click="updateLineProperties(true)"
                                                class="bg-secondarybg" icon="mdi-expand-all-outline" density="compact"
                                                size="medium" variant="flat" :readonly="!isLine()" />
                                        </template>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-slider v-model="lineProperties.width" min="0.5" max="10" step="0.5"
                                    :disabled="!isLine()" density="compact" />
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row align="center" no-gutters>
                                <v-col cols="auto">
                                    Marker size
                                </v-col>
                                <v-spacer />
                                <v-col cols="auto">
                                    <v-tooltip location="top" text="Apply size to all markers">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" @click="updateMarkerProperties(true)"
                                                class="bg-secondarybg" icon="mdi-expand-all-outline" density="compact"
                                                size="medium" variant="flat" :readonly="!plotMode.includes('marker')" />
                                        </template>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-slider v-model="markerProperties.size" min="1" max="12" step="1"
                                    :disabled="!plotMode.includes('marker')" density="compact" />
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <v-spacer />
                <v-col cols=" auto">
                    <v-row>
                        <v-color-picker style="max-width: 180px" v-model="lineProperties.color" hide-inputs
                            show-swatches :swatches="swatchColors" />
                    </v-row>
                    <v-row>
                        <v-switch label="Show in legend" v-model="legendSwitch" hide-details />
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        selectedPlotLine: {
            type: Number,
            required: true,
        },
        graphData: {
            type: Array,
            default: () => [""]
        }
    },
    data() {
        return {
            selectedTrace: 0,
            loadingTrace: false,
            plotMode: 'lines',
            modeOptions: ['lines', 'markers', 'lines+markers', 'dash', 'dot', 'dashdot'],
            legendLabel: '',
            legendSwitch: true,
            lineProperties: { width: 2.0, color: "", dash: "solid" },
            lineProperties0: { width: 2.0, color: "", dash: "solid" },
            markerProperties: { size: 6, symbol: 'circle' },
            markerProperties0: { size: 6, symbol: 'circle' },
            markerSymbols: ['circle', 'square', 'diamond', 'star', 'hexagram', 'cross', 'x'],
            markerStyle: 'solid',
            markerStyles: ['solid', 'open', 'dot', 'open-dot'],
            linePropertiesDrawer: false,
            plotlyDefaultColors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
        };
    },
    computed: {
        traceNames() {
            if (this.graphData.length == 0) return [""]
            return this.graphData.map((line, idx) => { return { id: idx, name: line.name } })
        },
        swatchColors() {
            // return [
            //     ['#FF0000', '#AA0000', '#550000'],
            //     ['#FFFF00', '#AAAA00', '#555500'],
            //     ['#00FF00', '#00AA00', '#005500'],
            //     ['#00FFFF', '#00AAAA', '#005555'],
            //     ['#0000FF', '#0000AA', '#000055'],
            // ]
            return [
                [...this.plotlyDefaultColors.slice(0, 2)],
                [...this.plotlyDefaultColors.slice(2, 4)],
                [...this.plotlyDefaultColors.slice(4, 6)],
                [...this.plotlyDefaultColors.slice(6, 8)],
                [...this.plotlyDefaultColors.slice(8)],
                ['#ff1493', '#000000'],
            ]
        },
        isFill() {
            return this.graphData[this.selectedTrace].fill
        }
    },
    emits: ['update-trace', 'apply-to-all', 'close-menu'],
    methods: {
        isLine() {
            return ['line', 'dash', 'dot'].some(style => this.plotMode.includes(style)) && !this.isFill
        },
        updateMarkerProperties(allLines = false) {
            if (this.loadingTrace) return
            const newMarkerProperties = { ...this.markerProperties }
            if (this.markerStyle != 'solid') {
                newMarkerProperties.symbol = newMarkerProperties.symbol + `-${this.markerStyle}`
            }
            if (!allLines) this.$emit('update-trace', this.selectedTrace, { marker: newMarkerProperties })
            else this.$emit('apply-to-all', { marker: { size: newMarkerProperties.size } })
        },
        updateLineProperties(allLines = false) {
            if (this.loadingTrace) return
            if (this.isFill) {
                this.$emit('update-trace', this.selectedTrace, { fillcolor: this.lineProperties.color })
                return
            }
            const newLineProperties = { ...this.lineProperties }
            let mode = this.plotMode
            switch (this.plotMode) {
                case 'dash':
                    newLineProperties.dash = 'dash'
                    mode = 'lines'
                    break;
                case 'dot':
                    newLineProperties.dash = 'dot'
                    mode = 'lines'
                    break;
                case 'dashdot':
                    newLineProperties.dash = 'dashdot'
                    mode = 'lines'
                    break;
                default:
                    newLineProperties.dash = 'solid'
            }
            if (!allLines) this.$emit('update-trace', this.selectedTrace, { mode: mode, line: { ...newLineProperties } })
            else this.$emit('apply-to-all', { mode: mode, line: { width: newLineProperties.width } })
        },
        updateAll(property = 'line') {
            if (property === 'line') {
                this.$emit('apply-to-all', { mode: 'lines', line: { dash: 'dash' } })
            }
        },
        updateShowLegend() {
            if (this.loadingTrace) return
            this.$emit('update-trace', this.selectedTrace, { showlegend: this.legendSwitch })
        },
        loadTraceState(traceIndex) {
            this.loadingTrace = true
            if (this.graphData[traceIndex].showlegend === undefined) this.legendSwitch = true
            else this.legendSwitch = this.graphData[traceIndex].showlegend
            if (this.graphData[traceIndex].marker) {
                const markerRegex = /(\w+)-?(open-dot|open|dot)?/
                const markerMatch = this.graphData[traceIndex].marker.symbol.match(markerRegex)
                this.markerProperties = {
                    size: this.graphData[traceIndex].marker.size,
                    symbol: markerMatch[1]
                }
                if (markerMatch[2]) this.markerStyle = markerMatch[2]
                else this.markerStyle = "solid"
            }
            else this.markerProperties = this.markerProperties0
            if (this.graphData[traceIndex].mode) this.plotMode = this.graphData[traceIndex].mode
            else this.plotMode = 'lines'
            if (this.graphData[traceIndex].line) {
                this.lineProperties = { ...this.lineProperties, ...this.graphData[traceIndex].line }
            } else this.lineProperties = {
                ...this.lineProperties0,
                color: this.plotlyDefaultColors[traceIndex % 10]
            }
            if (this.isFill) this.lineProperties.color = this.graphData[traceIndex].fillcolor
            this.loadingTrace = false
        }
    },
    watch: {
        selectedPlotLine() {
            this.selectedTrace = this.selectedPlotLine
        },
        plotMode() {
            this.updateLineProperties(false)
        },
        showLineProperties(newValue) {
            this.linePropertiesDrawer = newValue
        },
        lineProperties: {
            handler() {
                this.updateLineProperties(false)
            },
            deep: true
        },
        markerProperties: {
            handler() {
                this.updateMarkerProperties()
            },
            deep: true
        },
        legendLabel: {
            handler(newValue) {
                this.$emit('update-trace', this.selectedTrace, { name: newValue })
            }
        },
        selectedTrace: {
            handler(newValue) {
                // this.legendLabel = this.traceNames[newValue].names
                this.loadTraceState(newValue)
            }
        },
        traceNames: { // TODO: check how to handle this
            handler() {
                // this.legendLabel = this.traceNames[this.selectedTrace]
            }
        },
        markerStyle: {
            handler() {
                this.updateMarkerProperties()
            }
        },
        legendSwitch: {
            handler() {
                this.updateShowLegend()
            }
        }
    },
    mounted() {
        this.selectedTrace = this.selectedPlotLine
        this.loadTraceState(this.selectedTrace)
    }
};
</script>

<style scoped>
.style-selector {
    max-width: 150px;
    width: 150px;
}
</style>