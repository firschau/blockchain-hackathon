<template>
    <v-container>
        <v-card>
            <v-card-title>
                Consumption Plants
                <v-spacer></v-spacer>
                <v-btn @click="isNewConsumptionPlantDialogOpen = true" color="darkyellow">New Consumption Plant</v-btn>
            </v-card-title>
            <v-card-text class="pt-4">
                <v-img
                    v-if="generationPlantsChainData.length === 0"
                    src="../assets/undraw_factory.svg"
                    class="mx-auto"
                    width="50%"
                ></v-img>
                <v-row v-if="apiDataLoaded">
                    <v-col
                        cols="3"
                        v-for="generationPlant in generationPlantsChainData"
                        :key="generationPlant.idcAddress"
                    >
                        <consumption-plant-card
                            :chain-data="generationPlant"
                            :api-data="generationPlantsApiData[generationPlant.address]"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-dialog v-model="isNewConsumptionPlantDialogOpen" width="700">
            <new-consumption-plant-dialog
                v-if="isNewConsumptionPlantDialogOpen"
                @close="isNewConsumptionPlantDialogOpen = false"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NewConsumptionPlantDialog from '../components/NewConsumptionPlantDialog.vue'
import ConsumptionPlantCard from '../components/ConsumptionPlantCard.vue'
import { claimTypes } from '../utils/claims'

export default {
    name: 'ConsumptionPlantsView',

    components: {
        NewConsumptionPlantDialog,
        ConsumptionPlantCard,
    },

    data() {
        return {
            isNewConsumptionPlantDialogOpen: false,
            generationPlantsApiData: {},
            claimTypes,
            apiDataLoaded: false,
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
                const activeUsersGenerationPlants = data.filter((data) => data.owner === this.activeAccount)
                console.log(activeUsersGenerationPlants + ' ConsumptionPlants line 72 ')
                activeUsersGenerationPlants.forEach((plant) => {
                    //was macht hier $Set in GernationPlants.uve wo wird das dran gehängt ?
                    this.$set(this.generationPlantsApiData, plant.idcAddress, plant)
                })
                this.apiDataLoaded = true
            })
    },

    methods: {
        serializeClaim(claim) {
            return {
                ...claim,
                __data: JSON.parse(this.drizzleInstance.web3.utils.hexToAscii(claim.__data)),
            }
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('identityContracts', ['activeAccountIdentityContracts']),
        generationPlantsChainData() {
            return this.activeAccountIdentityContracts
                .filter((idc) =>
                    idc.claims.some((claim) => claim.__topic === claimTypes.RealWorldPlantIdClaim.toString())
                )
                .map((idc) => ({
                    address: idc.idcAddress,
                    [claimTypes.RealWorldPlantIdClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.RealWorldPlantIdClaim.toString()),
                    [claimTypes.BalanceClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.BalanceClaim.toString()),
                    [claimTypes.MeteringClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.MeteringClaim.toString()),
                    [claimTypes.ExistenceClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.ExistenceClaim.toString()),
                    [claimTypes.GenerationTypeClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.GenerationTypeClaim.toString()),
                    [claimTypes.LocationClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.LocationClaim.toString()),
                    [claimTypes.MaxPowerGenerationClaim]: idc.claims
                        .map(this.serializeClaim)
                        .find((claim) => claim.__topic === claimTypes.MaxPowerGenerationClaim.toString()),
                }))
        },
    },
}
</script>

<style></style>
