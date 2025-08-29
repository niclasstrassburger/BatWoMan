<template>
    <v-dialog v-model="dialog" width="auto" persistent>
        <v-card width="800px">
            <v-card-title>
                <v-row class="align-center">
                    <v-col cols="auto">
                        <v-icon icon="mdi-account-cog" />
                        </v-col>
                    <v-col cols="auto">
                        User preferences
                        </v-col>
                        <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <v-btn class="ms-2" color="error" @click="dialog = false">Close</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            
            <v-card-title>
                Plot defaults
            </v-card-title>
            <v-card-text>
            <!-- Default line style (general)
            Line width
            Marker size
            Default line style (cycles)
            Line width
            Marker size -->
            <v-row>
                <v-col>
            <h3>Legend</h3>
        </v-col>
        </v-row>
            <v-row class="align-center" dense>
                <v-col cols="3">
                    Show step
                </v-col>
                <v-col cols="9">
                    <v-checkbox v-model="localUserPref.plot.legend.showStep" />
                </v-col>
            </v-row>
            <v-row class="align-center" dense>
                <v-col cols="3">
                    Text size
                </v-col>
                <v-col cols="9">
                    <v-select v-model="localUserPref.plot.legend.textSize" :items="[10, 12, 14, 16, 18]" max-width="120px" density="compact"></v-select>
                </v-col>
            </v-row>
        </v-card-text>
            <!-- Legend size [normal, compact, very compact] -->
             <!-- <v-divider /> -->
            <!-- <v-card-title>
                <v-row dense>
                    <v-col cols="auto">
                Cell
                </v-col>
            </v-row>
            </v-card-title> -->
            <v-card-text>
            <!-- <v-row class="align-center" dense>
                <v-col cols="3">
                    Area [cm²]
                </v-col>
                    <CellAreaSelector v-model:area="localUserPref.cell.area"/>
            </v-row> -->
            <v-row>
                <v-col cols="3">    
                    <v-btn @click="setDefaultUserPreferences" block color="green">Restore</v-btn>
                </v-col>
                <v-col cols="9">
                    <v-btn @click="updateUserPreferences(localUserPref)" block color="primary">Update preferences</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAppStore } from '@/stores/app';

export default {
    data() {
        return {
            localUserPref: {legend: {}, },
            dialog: false,
        }
    },
    props: {
        parentDialog: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:parentDialog'],
    computed: {
        ...mapState(useAppStore, ['userPreferences'])
    },
    watch: {
        userPreferences: {
            handler(newPrefs) {
                this.localUserPref = JSON.parse(JSON.stringify(newPrefs))
            },
            deep: true,
        },
        dialog: {
            handler(){
                this.$emit('update:parentDialog', this.dialog)
            }
        },
        parentDialog: {
            handler(newVal){
                if (newVal) return
                this.dialog = newVal
            }
        }
    },
    methods: {
        ...mapActions(useAppStore, ['updateUserPreferences', 'setDefaultUserPreferences'])
    },
    mounted() {
        this.localUserPref = JSON.parse(JSON.stringify(this.userPreferences))
        this.dialog = this.parentDialog
    }
}
</script>