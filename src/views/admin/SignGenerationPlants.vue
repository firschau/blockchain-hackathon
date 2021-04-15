<template>
    <v-container>
        <v-card>
            <v-card-title>New Generation Plants to Sign</v-card-title>
            <v-card-text>
                <v-row v-if="filteredGenerationPlants.length">
                    <v-col cols="3" v-for="generationPlant in filteredGenerationPlants" :key="generationPlant.id">
                        <sign-plant-card :plant="generationPlant" plant-type="generation" />
                    </v-col>
                </v-row>
                <v-img v-else src="@/assets/undraw_wind_turbine.svg" class="mx-auto" width="50%"></v-img>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import SignPlantCard from '@/components/admin/SignPlantCard'
import { mapGetters } from 'vuex'
import { claimTypes } from '@/utils/claims'

export default {
    name: 'SignGenerationPlants',

    components: {
        SignPlantCard,
    },

    data() {
        return {
            generationPlants: [],
        }
    },

    created() {
        fetch('/api/generationPlants', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.generationPlants = data
            })
    },

    computed: {
        ...mapGetters('identityContracts', [
            'activeAccountIsBalanceAuthority',
            'activeAccountIsMeteringAuthority',
            'activeAccountIsPhysicalAssetAuthority',
        ]),
        filteredGenerationPlants() {
            return this.generationPlants.filter(
                (plant) =>
                    (!plant.signatures[claimTypes.BalanceClaim] && this.activeAccountIsBalanceAuthority) ||
                    (this.activeAccountIsMeteringAuthority && !plant.signatures[claimTypes.MeteringClaim]) ||
                    (this.activeAccountIsPhysicalAssetAuthority &&
                        (!plant.signatures[claimTypes.ExistenceClaim] ||
                            !plant.signatures[claimTypes.GenerationTypeClaim] ||
                            !plant.signatures[claimTypes.LocationClaim] ||
                            !plant.signatures[claimTypes.MaxPowerGenerationClaim]))
            )
        },
    },
}
</script>

<style></style>
