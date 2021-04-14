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
                        <consumption-plant-card :consumption-plant="consumptionPlant" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="isNewConsumptionPlantDialogOpen" width="700">
            <new-consumption-plant-dialog
                v-if="isNewConsumptionPlantDialogOpen"
                @consumption-plant-added="addConsumptionPlant"
                @close="isNewConsumptionPlantDialogOpen = false"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewConsumptionPlantDialog from '@/components/consumptionPlants/NewConsumptionPlantDialog.vue'
import ConsumptionPlantCard from '@/components/consumptionPlants/ConsumptionPlantCard.vue'

export default {
    name: 'ConsumptionPlantsView',

    components: {
        NewConsumptionPlantDialog,
        ConsumptionPlantCard,
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

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
