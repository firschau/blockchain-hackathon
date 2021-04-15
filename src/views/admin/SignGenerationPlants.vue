<template>
    <v-container>
        <v-card>
            <v-card-title>New Generation Plants to Sign</v-card-title>
            <v-card-text>
                <v-row v-if="filteredGenerationPlants.length">
                    <v-col cols="3" v-for="generationPlant in filteredGenerationPlants" :key="generationPlant.id">
                        <sign-generation-plant-card :generation-plant="generationPlant" />
                    </v-col>
                </v-row>
                <v-img v-else src="@/assets/undraw_wind_turbine.svg" class="mx-auto" width="50%"></v-img>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import SignGenerationPlantCard from '@/components/admin/SignGenerationPlantCard'
import { mapGetters } from 'vuex'

export default {
    name: 'SignGenerationPlants',

    components: {
        SignGenerationPlantCard,
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
                    (!plant.signatures.BalanceClaim && this.activeAccountIsBalanceAuthority) ||
                    (this.activeAccountIsMeteringAuthority && !plant.signatures.MeteringClaim) ||
                    (this.activeAccountIsPhysicalAssetAuthority &&
                        (!plant.signatures.ExistenceClaim ||
                            !plant.signatures.GenerationTypeClaim ||
                            !plant.signatures.LocationClaim ||
                            !plant.signatures.MaxPowerGenerationClaim))
            )
        },
    },
}
</script>

<style></style>
