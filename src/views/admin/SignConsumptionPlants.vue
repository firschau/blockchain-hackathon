<template>
    <v-container>
        <v-card>
            <v-card-title> New Consumption Plants to Sign </v-card-title>
            <v-card-text>
                <v-row v-if="filteredConsumptionPlants.length">
                    <v-col cols="3" v-for="consumptionPlant in filteredConsumptionPlants" :key="consumptionPlant.id">
                        <sign-consumption-plant-card :consumption-plant="consumptionPlant" />
                    </v-col>
                </v-row>
                <v-img v-else src="@/assets/undraw_houses.svg" class="mx-auto" width="50%"></v-img>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import SignConsumptionPlantCard from '@/components/admin/SignConsumptionPlantCard'
import { mapState } from 'vuex'
export default {
    name: 'NewConsumptionPlants',

    components: {
        SignConsumptionPlantCard,
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
