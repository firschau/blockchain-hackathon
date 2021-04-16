<template>
    <v-container>
        <v-card>
            <v-card-title> New Consumption Plants to Sign </v-card-title>
            <v-card-text>
                <v-row v-if="filteredConsumptionPlants.length">
                    <v-col cols="3" v-for="consumptionPlant in filteredConsumptionPlants" :key="consumptionPlant.id">
                        <sign-plant-card :plant="consumptionPlant" plant-type="consumption" />
                    </v-col>
                </v-row>
                <v-img v-else src="@/assets/undraw_houses.svg" class="mx-auto" width="50%"></v-img>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import SignPlantCard from '@/components/admin/SignPlantCard'
import { mapGetters } from 'vuex'
import { claimTypes } from '@/utils/claims'

export default {
    name: 'NewConsumptionPlants',

    components: {
        SignPlantCard,
    },

    data() {
        return {
            consumptionPlants: [],
        }
    },

    // load all plants on load
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
        ...mapGetters('identityContracts', [
            'activeAccountIsBalanceAuthority',
            'activeAccountIsMeteringAuthority',
            'activeAccountIsPhysicalAssetAuthority',
        ]),

        // returns consumption plants filtered by those relevant for the active account
        filteredConsumptionPlants() {
            return this.consumptionPlants.filter(
                (plant) =>
                    (!plant.signatures[claimTypes.BalanceClaim] && this.activeAccountIsBalanceAuthority) ||
                    (this.activeAccountIsMeteringAuthority && !plant.signatures[claimTypes.MeteringClaim]) ||
                    (this.activeAccountIsPhysicalAssetAuthority &&
                        (!plant.signatures[claimTypes.ExistenceClaim] ||
                            !plant.signatures[claimTypes.MaxPowerConsumptionClaim] ||
                            !plant.signatures[claimTypes.LocationClaim]))
            )
        },
    },
}
</script>

<style></style>
