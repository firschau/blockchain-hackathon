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
                        <generation-plant-card :generation-plant="generationPlant" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="isNewGenerationPlantDialogOpen" width="700">
            <new-generation-plant-dialog
                v-if="isNewGenerationPlantDialogOpen"
                @generation-plant-added="addGenerationPlant"
                @close="isNewGenerationPlantDialogOpen = false"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewGenerationPlantDialog from '@/components/generationPlants/NewGenerationPlantDialog.vue'
import GenerationPlantCard from '@/components/generationPlants/GenerationPlantCard.vue'

export default {
    name: 'GenerationPlantsView',

    components: {
        NewGenerationPlantDialog,
        GenerationPlantCard,
    },

    data() {
        return {
            isNewGenerationPlantDialogOpen: false,
            generationPlants: {},
        }
    },

    created() {
        this.loadGenerationPlants()
    },

    methods: {
        loadGenerationPlants() {
            fetch('/api/generationPlants', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const activeUsersGenerationPlants = data.filter((data) => data.owner === this.activeAccount)
                    activeUsersGenerationPlants.forEach((plant) => {
                        this.$set(this.generationPlants, plant.idcAddress, plant)
                    })
                })
        },
        addGenerationPlant(generationPlant) {
            this.$set(this.generationPlants, generationPlant.idcAddress, generationPlant)
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
