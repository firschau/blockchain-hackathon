<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-row>
                    <v-col cols="3" v-for="generationPlant in filteredGenerationPlants" :key="generationPlant.id">
                        <new-generation-plant-card :generation-plant="generationPlant" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import NewGenerationPlantCard from '../components/NewGenerationPlantCard'
import { mapState } from 'vuex'
export default {
    name: 'NewGenerationPlants',

    components: {
        NewGenerationPlantCard,
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
        ...mapState('currentUser', ['isBalanceAuthority', 'isMeteringAuthority', 'isPhysicalAssetAuthority']),
        filteredGenerationPlants() {
            return this.generationPlants.filter(
                (plant) =>
                    (!plant.signatures.BalanceClaim && this.isBalanceAuthority) ||
                    (this.isMeteringAuthority && !plant.signatures.MeteringClaim) ||
                    (this.isPhysicalAssetAuthority &&
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
