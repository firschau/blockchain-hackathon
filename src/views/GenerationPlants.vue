<template>
    <v-container>
        <v-card>
            <v-card-title>
                Generation Plants
                <v-spacer></v-spacer>
                <v-btn @click="isNewGenerationPlantDialogOpen = true" color="primary">New Generation Plant</v-btn>
            </v-card-title>
            <v-card-text class="pt-4">
                <v-img
                    v-if="Object.keys(generationPlants).length === 0"
                    src="../assets/undraw_wind_turbine.svg"
                    class="mx-auto"
                    width="50%"
                ></v-img>
                <v-row v-if="Object.keys(generationPlants).length">
                    <v-col cols="3" v-for="generationPlant in generationPlants" :key="generationPlant.idcAddress">
                        <plant-card :plant="generationPlant" plant-type="generation" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="isNewGenerationPlantDialogOpen" width="700">
            <new-plant-dialog
                v-if="isNewGenerationPlantDialogOpen"
                type="generation"
                @plant-added="addGenerationPlant"
                @close="isNewGenerationPlantDialogOpen = false"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewPlantDialog from '@/components/plants/NewPlantDialog.vue'
import PlantCard from '@/components/plants/PlantCard.vue'

export default {
    name: 'GenerationPlantsView',

    components: {
        NewPlantDialog,
        PlantCard,
    },

    data() {
        return {
            isNewGenerationPlantDialogOpen: false,

            // [identityContractAddress]: plant
            generationPlants: {},
        }
    },

    // called on crated
    created() {
        this.loadGenerationPlants()
    },

    methods: {
        /**
         * filteres the loaded plants by those owned by the active account
         */
        loadGenerationPlants() {
            this.generationPlants = {}
            fetch('/api/generationPlants', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // filter plants and set the state
                    const activeUsersGenerationPlants = data.filter((data) => data.owner === this.activeAccount)
                    activeUsersGenerationPlants.forEach((plant) => {
                        this.$set(this.generationPlants, plant.idcAddress, plant)
                    })
                })
        },

        // adds a new consumption plant to the state
        addGenerationPlant(generationPlant) {
            this.$set(this.generationPlants, generationPlant.idcAddress, generationPlant)
        },
    },

    watch: {
        // reloads the plants if the active account changed
        activeAccount: function () {
            console.log('activeAccountchanged')
            this.loadGenerationPlants()
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
