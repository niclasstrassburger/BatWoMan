<template>
    <v-container fluid >
        <v-card-title class="mt-n3">
            <v-row align-center dense class="text-h6">
                <v-col cols="auto">
                    Homepage [v1.5.0]
                </v-col>
            </v-row>
            <v-divider class=" mt-1 mx-n5 border-opacity-50" thickness="4" color="#D4E7D4" />
        </v-card-title>

        <v-card class="mt-2" style="width: 100%;">
            <v-img src="@/assets/batwoman_homepage3.png" contain height="auto" width="100%"/>
        </v-card>

        <v-card class="mt-2">
            <v-card-title> 
                <v-row align-center dense class="text-h6">
                    <v-col cols="auto">
                        BatWoMan Manufacturing Models
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text>
            <v-col cols="auto">
                    <p>Below is a list of BatWoMan manufacturing models for simulating various steps of the aqueous NMC622 electrode 
                    manufacturing process.</p>
                        <li>CIDETEC Coating & Drying simulation: ML model for predicting aqueous NMC622 electrode coating in manufacturing </li>
                        <li>CIDETEC Calendering simulation: ML model for predicting aqueous NMC622 electrode calendering in manufacturing</li>
                        <li>UDE Wetting simulation: Simplified multiphysics model for simulating aqueous NMC622 electrode wetting process</li>
                        <li>UDE Drying simulation: Simplified multiphysics model for simulating aqueous NMC622 electrode drying process</li>
                        <li>UDE Cell Performance simulation: Simplified multiphysics model for simulating structured aqueous NMC622 electrode || Graphite cell performance</li>
            </v-col>
            </v-card-text>
                <v-card-subtitle class="text-subtitle-1">More information at
                    <a href="https://batwoman.eu/digital-twin-tools-for-lithium-ion-battery-manufacturing/" target="_blank" rel="noopener noreferrer">BatWoMan</a>
                </v-card-subtitle>
                <v-card-subtitle class="text-subtitle-1">Code available at 
                    <a href="https://github.com/niclasstrassburger/BatWoMan"  target="_blank" rel="noopener noreferrer">GitHub</a>  
                </v-card-subtitle>
        </v-card>
        
    </v-container>
</template>

<script>
export default {
    name: 'ManufacturingHomepageView',
}
</script>
