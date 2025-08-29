<template>
    <v-container fluid>
        <v-card-title class="mt-n3">
            <v-row align-center dense class="text-h6">
                <v-col cols="auto">
                    CIDETEC Calendering Simulation
                </v-col>
            </v-row>
            <v-divider class=" mt-1 mx-n5 border-opacity-50" thickness="4" color="#D4E7D4" />
        </v-card-title>
        

        <v-card class="mt-2"  style="width: 100%; height: 261px;">
                <v-img src="@/assets/cidetec_electrode_black_white_v2.jpg" contain height="auto" width="100%" />

        </v-card>

        <v-row>
            <v-col cols="8">
            <v-card class="mt-2">
            <v-card-text>
            <h3>Inputs</h3>

            <v-row>
                <v-col cols="6">
                <v-table density="compact" style="margin-top:2%;">
                <thead>
                <tr>
                    <th class="text-left" style="width: 50%;">Parameter Name</th>
                    <th class="text-left" style="width: 50%;">Value</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, index) in rows.slice(0, Math.ceil(rows.length / 2))" :key="index">
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

                <v-col cols="6">
                <v-table density="compact" style="margin-top:2%;">
                <thead>
                    <tr>
                        <th class="text-left" style="width: 65%;">Parameter Name</th>
                        <!-- <th class="text-left" style="width: 5%;">Unit</th> -->
                        <th class="text-left" style="width: 35%;">Value</th>
                    </tr>
                </thead>
                    <tbody>
                        <tr v-for="(row, index) in rows.slice(Math.ceil(rows.length / 2))" :key="index + Math.ceil(rows.length / 2)">
                            <td>
                                <v-icon small class="ml-0" color="grey" v-tooltip:bottom="row.tooltip">mdi-information</v-icon>
                                {{ row.parameterName }}
                            </td>
                            <td>
                                <v-text-field v-model="row.value" @change="saveRow(index + Math.ceil(rows.length / 2))" dense hide-details solo   
                                    density="compact" variant="outlined" :suffix="row.unit"/>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                </v-col>
            </v-row>

            <v-btn color="primary" style='margin-top:1%; width: 100%;' @click="runSimulation" 
                rounded="xl"
                density="compact">Run Simulation</v-btn>

            </v-card-text>
            </v-card>
            </v-col>

            <v-col cols="4">
            <v-card class="mt-2" style="width: 100%; height: 100%;">
                <v-card-text> 
                <h3>Outputs</h3>
                <v-table density="compact" style="margin-top:2%;">
                    <thead>
                        <tr>
                            <th class="text-left" style="width: 60%;">Parameter Name</th>
                            <th class="text-left" style="width: 40%;">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(output, index) in outputs.slice(0, Math.ceil(outputs.length))" :key="index">
                            <td>
                                <v-icon small class="ml-0" color="grey" v-tooltip:bottom="output.tooltip">mdi-information</v-icon>
                                {{ output.parameterName }}</td>
                            <td>
                                <v-text-field v-model="output.value" dense hide-details readonly
                                    density="compact" variant="outlined" :suffix="output.unit"/></td>
                        </tr>
                    </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import Swal from 'sweetalert2'
export default {
    name: 'ManufacturingCalenderingView',
    data() {
        return {
            showParametersRange: false,
            rows: [
                { parameterName: 'Electrode loading', unit: 'mAh/cm2', value: 3.97, 
                        min_value: 3.61, max_value: 4.01, message:"Electrode loading should be between 3.61mAh/cm2 and 4.01mAh/cm2",
                        tooltip: "The loading property of the electrode" },
                { parameterName: 'Calendering Speed', unit: 'm/min', value: 1, 
                        min_value: 1, max_value: 3, message:"Calendering speed should be between 1m/min and 3m/min", 
                        tooltip: "The speed of the " },
                { parameterName: 'Calendering Gap', unit: 'µm', value: 52.3, 
                        min_value: 49.5, max_value: 60.1, message:"Calendering gap should be between 49.5µm and 60.1µm", 
                        tooltip: "Additional distance between rolls on calendering" },
                { parameterName: 'Calendering Pressure', unit: 'kN', value: 10.1, 
                        min_value: 9, max_value: 10.9, message:"Calendering pressure should be between 9kN and 10.9kN", 
                        tooltip: "The pressure perfoms the press roll to the electrode" },
                { parameterName: 'Calendering Roll Temperature', unit: '°C', value: 86, 
                        min_value: 25, max_value: 106.5, message:"Calendering roll temperature should be between 25°C and 106.5°C", 
                        tooltip: "The temperature of the roll before calendering" },
            ],
            outputs:[
                { parameterName: 'Electrode Thickness', unit: 'µm', value: 100, 
                    tooltip: "Electrode thickness after calendering",
                },
                { parameterName: 'Electrode Thickness after long term springback', unit: 'µm', value: 102, 
                    tooltip: "Electrode thickness after calendering and long term springback",
                },
            ]
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
                return this.$axiosProteoDA.post('/manufacturing/calendering/', this.rows)
            })
            .then((res) => {
                const data = res.data
                this.outputs[0].value = parseFloat(data['elec_thickness']).toFixed(2)
                this.outputs[1].value = parseFloat(data['elec_thickness_post']).toFixed(2)
            })
        }, 
    }
}
</script>
