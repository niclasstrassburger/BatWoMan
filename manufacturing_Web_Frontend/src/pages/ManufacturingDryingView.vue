<template>
    <v-container fluid>
        <v-card-title class="mt-n3">
            <v-row align-center dense class="text-h6">
                <v-col cols="auto">
                    UDE Drying Simulation
                </v-col>
            </v-row>
            <v-divider class=" mt-1 mx-n5 border-opacity-50" thickness="4" color="#D4E7D4" />
        </v-card-title>
        

        <v-card class="mt-2"  style="width: 100%; height: 213.8px;">
                <v-img src="@/assets/batwoman_drying_3.png" contain height="auto" width="100%" />

        </v-card>

        <v-row>
            <v-col cols="4">
            <v-card class="mt-2" style="width: 100%; height: 100%;">
            <v-card-text>
            <h3>Inputs</h3>

            <v-row>
                <v-col cols="12">
                <v-table density="compact" style="margin-top:2%;">
                <thead>
                <tr>
                    <th class="text-left" style="width: 55%;">Parameter Name</th>
                    <th class="text-left" style="width: 45%;">Value</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, index) in rows.slice(0, Math.ceil(rows.length))" :key="index">
                    <td>
                        <v-icon small class="ml-0" color="grey" v-tooltip:bottom="row.tooltip">mdi-information</v-icon>
                        {{ row.parameterName }}
                    </td>
                    <!-- <td>{{ row.unit }}</td> -->
                    <td>
                        <v-text-field v-model="row.value" @change="saveRow(index)" dense hide-details solo 
                            density="compact" variant="outlined" :suffix="row.unit"/>

                    </td>
                </tr>
                </tbody>
                </v-table>
                </v-col>
            </v-row>

            <h3 style='margin-top:6%;'>Constants</h3>

            <v-row>
                <v-col cols="12">
                <v-table density="compact" style="margin-top:2%;">
                <thead>
                <tr>
                    <th class="text-left" style="width: 55%;">Parameter Name</th>
                    <th class="text-left" style="width: 45%;">Value</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, index) in constant_values.slice(0, Math.ceil(constant_values.length))" :key="index">
                    <td>
                        <!-- <v-icon small class="ml-0" color="grey" v-tooltip:bottom="row.tooltip">mdi-information</v-icon> -->
                        {{ row.parameterName }}
                    </td>
                    <!-- <td>{{ row.unit }}</td> -->
                    <td>
                        <v-text-field v-model="row.value" dense hide-details solo disabled
                            density="compact" variant="outlined" :suffix="row.unit"/>

                    </td>
                </tr>
                </tbody>
                </v-table>
                </v-col>
            </v-row>

            <v-btn color="primary" style='margin-top:5%; width: 100%;' @click="runSimulation" 
                rounded="xl"
                density="compact">Run Simulation</v-btn>

            </v-card-text>
            </v-card>
            </v-col>

            <v-col cols="8">
            <v-card class="mt-2" style="width: 100%; height: 100%;">
                <v-card-text> 
                <h3>Results</h3>
                <div id='results-table' hidden>
                <v-table density="compact" style="margin-top:2%;">
                    <thead>
                        <tr>
                            <th class="text-left" style="width: 50%;">Parameter Name</th>
                            <th class="text-left" style="width: 50%;">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(output, index) in outputs.slice(0, Math.ceil(outputs.length))" :key="index">
                            <td>
                                <v-icon small class="ml-0" color="grey" v-tooltip:bottom="output.tooltip">mdi-information</v-icon>
                                {{ output.parameterName }}</td>
                            <td>
                                <v-text-field v-model="output.value" dense hide-details readonly
                                    density="compact" variant="outlined" :suffix="output.unit"/>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                </div>
                <div id='plotdiv'></div>
                </v-card-text>
            </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>

import Swal from 'sweetalert2'
export default {
    name: 'ManufacturingDryingView',
    data() {
        return {
            showParametersRange: false,
            rows: [
                { parameterName: 'Initial moisture content', unit: 'kg/m3', value: 4.2, 
                        min_value: 1, max_value: 6, message:"Initial moisture content should be between 1kg/m3 and 6kg/m3",
                        tooltip: "The water content of the electrode at the beginning of drying in the drying chamber" },
                { parameterName: 'Final moisture content', unit: 'kg/m3', value: 0.95, 
                        min_value: 0, max_value: 2, message:"Final moisture content should be between 0kg/m3 and 2kg/m3", 
                        tooltip: "The minimum water content of the electrode in the drying chamber, which is reached as an equilibrium state after a very long drying time" },
                { parameterName: 'Spacing', unit: 'µm', value: 160, 
                        min_value: 100, max_value: 250, message:"Spacing should be between 100µm and 250µm", 
                        tooltip: "The width of the electrode blocks between two grooves or the distance between two grooves." },
                { parameterName: 'Depth', unit: 'µm', value: 181, 
                        min_value: 100, max_value: 191, message:"Depth should be between 100µm and 191µm", 
                        tooltip: "The depth of the groove" },
            ],
            constant_values:[
                { parameterName: 'Electrode thickness', unit: 'μm', value: 100},
                { parameterName: 'Electrode porosity', unit: '%', value: 35},
                { parameterName: 'Electrode geometry', unit: '', value: 'structured'},

            ],
            outputs:[
                { parameterName: 'Final Time', unit: 'min', value: 0, 
                tooltip: "Estimated time to reach the desired final moisture content",},
            ],
        }
    },
    methods: {
        saveRow(index) {
            // console.log('Row saved:', this.rows[index]);
        },
        validate_inputs(){
            return new Promise((resolve, reject) => {
            var warning_message = ""
            var show_warning = false

            for (let index = 0; index < this.rows.length; index++) {
                const element = this.rows[index];
                if (element.value < element.min_value || element.value > element.max_value) {
                    warning_message = warning_message.concat("<br>", element.message)
                    show_warning = true
                }
            }
            if (show_warning) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Input values out of range',
                    html: warning_message,
                    confirmButtonText: 'Continue',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if (result.isConfirmed) {
                        resolve(); // Continue simulation after user closes the warning
                    } else {
                    reject(); // Stop simulation if user cancels
                    }   
                });
            } else {
                resolve(); // No warnings, continue immediately
            }
            });
        },
        runSimulation(){
            this.validate_inputs()
            .then(() => {
                return this.$axiosProteoDA.post('/manufacturing/dryingUDE/', this.rows);
            })
            .then((res) => {
                const data = res.data
                console.log(data)
                let plot_Y = data['w_kg_m3']
                let plot_X = data['t_min']
                let plot_div = document.getElementById('plotdiv')
                let x_label = 'Time (min)'
                let y_label = 'Moisture content (kg/m3)'
                let legend = 'Spacing: ' + this.rows[2].value + ' µm, Depth: ' + this.rows[3].value + ' µm  '
                var layout = {
                    title: {
                        text: 'Evolution of moisture content during drying',
                        font: {
                            family: 'Arial, sans-serif',
                            size: 14,
                            color: 'black'
                        }
                    },
                    font: {
                        family: 'Arial, sans-serif',
                        size: 14,
                        color: 'black'
                    },
                    legend: {
                        x: 1,
                        y: 1,
                        xanchor: 'right',
                        yanchor: 'top',
                        font: {
                            family: 'Arial, sans-serif',
                            size: 14,
                            color: 'black'
                        }
                    },
                    autosize: false,
                    width: 700,
                    height: 400,
                    xaxis: {
                        showgrid: true,
                        ticks: 'outside',
                        tickformat: '',
                        exponentformat: 'power',
                        showexponent: 'all',
                        minexponent: 5,
                        showline: true,
                        linewidth: 1,
                        color: 'black',
                        mirror: true,
                        automargin: true,
                        title: {
                            text: x_label,
                            font: {
                                family: 'Arial, sans-serif',
                                size: 14,
                                color: 'black'
                            }
                        }
                    },
                    yaxis: {
                        showgrid: true,
                        showline: true,
                        zeroline: false,
                        linewidth: 1,
                        color: 'black',
                        mirror: true,
                        automargin: true,
                        ticks: 'outside',
                        tickformat: '',
                        exponentformat: 'power',
                        showexponent: 'all',
                        minexponent: 4,
                        title: {
                            text: y_label,
                            font: {
                                family: 'Arial, sans-serif',
                                size: 14,
                                color: 'black'
                            }
                        }
                    },
                    margin: { l: -10, r: 0, t: 40, b: 40 },
                    plot_bgcolor: '#fff',
                    paper_bgcolor: '#fff'
                };

                import('plotly.js-dist').then(Plotly => {
                    let trace = {
                        x: plot_X,
                        y: plot_Y,
                        type: 'scatter',
                        mode: 'lines',
                        name: legend // Add legend here
                        // line: { color: 'black' }
                    };
                    // If plot already exists, add new trace
                    if (plot_div.data && plot_div.data.length > 0) {
                        Plotly.addTraces(plot_div, trace);
                    } else {
                        Plotly.newPlot(plot_div, [trace], layout, {responsive: true});
                        let hline = {
                            x: plot_X,
                            y: Array(plot_X.length).fill(0.95),
                            type: 'scatter',
                            mode: 'lines',
                            name: 'y = 0.95',
                            line: { dash: 'dash', color: 'red', width: 2 }
                        };
                        Plotly.addTraces(plot_div, hline);
                    }
                });
                // Swal.close();
                // console.log(plot_Y)
                const threshold = 0.96;
                const index = plot_Y.findIndex(value => value < threshold);
                this.outputs[0].value = plot_X[index]
                document.getElementById('results-table').hidden = false;
            })
        }, 
    }
}
</script>
