<template>
    <v-container>
        <v-card>
            <v-card-title>
                Consumption Plants
                <v-spacer></v-spacer>
                <v-btn @click="isNewConsumptionPlantDialogOpen = true" color="primary">New Consumption Plant</v-btn>
            </v-card-title>
            <v-card-text class="pt-4">
                <v-img
                    v-if="Object.keys(consumptionPlants).length === 0"
                    src="../assets/undraw_houses.svg"
                    class="mx-auto"
                    width="50%"
                ></v-img>
                <v-row v-if="Object.keys(consumptionPlants).length">
                    <v-col cols="3" v-for="consumptionPlant in consumptionPlants" :key="consumptionPlant.idcAddress">
                        <plant-card :plant="consumptionPlant" plant-type="consumption" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="isNewConsumptionPlantDialogOpen" width="700">
            <new-plant-dialog
                v-if="isNewConsumptionPlantDialogOpen"
                type="consumption"
                @plant-added="addConsumptionPlant"
                @close="isNewConsumptionPlantDialogOpen = false"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewPlantDialog from '@/components/plants/NewPlantDialog.vue'
import PlantCard from '@/components/plants/PlantCard.vue'

export default {
    name: 'ConsumptionPlantsView',

    components: {
        NewPlantDialog,
        PlantCard,
    },

    data() {
        return {
            isNewConsumptionPlantDialogOpen: false,
            consumptionPlants: {},
        }
    },

    created() {
        this.loadConsumptionPlants()
    },

    methods: {
        loadConsumptionPlants() {
            this.consumptionPlants = {}
            fetch('/api/consumptionPlants', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const activeUsersConsumptionPlants = data.filter((data) => data.owner === this.activeAccount)
                    activeUsersConsumptionPlants.forEach((plant) => {
                        this.$set(this.consumptionPlants, plant.idcAddress, plant)
                    })
                })
        },
        addConsumptionPlant(consumptionPlant) {
            this.$set(this.consumptionPlants, consumptionPlant.idcAddress, consumptionPlant)
        },
    },

    watch: {
        activeAccount: function () {
            this.loadConsumptionPlants()
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
