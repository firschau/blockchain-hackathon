<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-row>
                    <v-col cols="3" v-for="consumptionPlant in filteredConsumptionPlants" :key="consumptionPlant.id">
                        <new-consumption-plant-card :consumption-plant="consumptionPlant" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import NewConsumptionPlantCard from '../components/NewConsumptionPlantCard'
import { mapState } from 'vuex'
export default {
    name: 'NewConsumptionPlants',

    components: {
        NewConsumptionPlantCard,
    },

    data() {
        return {
            consumptionPlants: [],
        }
    },

    created() {
        fetch('/api/consumptionPlants', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.consumptionPlants = data
            })
    },

    computed: {
        ...mapState('currentUser', ['isBalanceAuthority', 'isMeteringAuthority', 'isPhysicalAssetAuthority']),
        filteredConsumptionPlants() {
            return this.consumptionPlants.filter(
                (plant) =>
                    (!plant.signatures.BalanceClaim && this.isBalanceAuthority) ||
                    (this.isMeteringAuthority && !plant.signatures.MeteringClaim) ||
                    (this.isPhysicalAssetAuthority &&
                        (!plant.signatures.ExistenceClaim || !plant.signatures.MaxPowerConsumptionClaim))
            )
        },
    },
}
</script>

<style></style>
