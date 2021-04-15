<template>
    <v-card>
        <div class="pa-1">
            <v-img v-if="plantType === 'generation'" src="@/assets/undraw_wind_turbine.svg" contain></v-img>
            <v-img v-else src="@/assets/undraw_houses.svg" contain></v-img>
        </div>
        <v-divider />
        <v-card-text>
            <v-row dense>
                <v-col cols="8">
                    <div>
                        <b>Expiry Date:</b>
                        {{ expiryDate }}
                    </div>
                    <div>
                        <b>Real World Plant Id:</b>
                        {{ realWorldPlantId }}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="ExistenceClaim === 'claimed'" color="success" large>mdi-check-circle</v-icon>
                        <v-btn @click="addExistenceClaim" v-if="ExistenceClaim === 'approved'" color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="ExistenceClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col v-if="plantType === 'generation'" cols="8">
                    <span>
                        <b>Plant Type:</b>
                        {{ generationPlantType }}
                    </span>
                </v-col>
                <v-col v-if="plantType === 'generation'" cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="GenerationTypeClaim === 'claimed'" color="success" large>mdi-check-circle</v-icon>
                        <v-btn @click="addGenerationTypeClaim" v-if="GenerationTypeClaim === 'approved'" color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="GenerationTypeClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col v-if="plantType === 'consumption'" cols="8">
                    <span>
                        <b>Max Consumption Capacity:</b>
                        {{ maxCon }}
                    </span>
                </v-col>
                <v-col v-if="plantType === 'consumption'" cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="MaxPowerConsumptionClaim === 'claimed'" color="success" large
                            >mdi-check-circle</v-icon
                        >
                        <v-btn
                            @click="addMaxPowerConsumptionClaim"
                            v-if="MaxPowerConsumptionClaim === 'approved'"
                            color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="MaxPowerConsumptionClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col v-if="plantType === 'generation'" cols="8">
                    <span>
                        <b>Max Generation Capacity:</b>
                        {{ maxGen }}
                    </span>
                </v-col>
                <v-col v-if="plantType === 'generation'" cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="MaxPowerGenerationClaim === 'claimed'" color="success" large
                            >mdi-check-circle</v-icon
                        >
                        <v-btn
                            @click="addMaxPowerGenerationClaim"
                            v-if="MaxPowerGenerationClaim === 'approved'"
                            color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="MaxPowerGenerationClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col cols="8">
                    <div>
                        <b>lat:</b>
                        {{ lat }}
                    </div>
                    <div>
                        <b>long:</b>
                        {{ long }}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="LocationClaim === 'claimed'" color="success" large>mdi-check-circle</v-icon>
                        <v-btn @click="addLocationClaim" v-if="LocationClaim === 'approved'" color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="LocationClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col cols="8"> <b> Metering Claim </b> </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="MeteringClaim === 'claimed'" color="success" large>mdi-check-circle</v-icon>
                        <v-btn @click="addMeteringClaim" v-if="MeteringClaim === 'approved'" color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="MeteringClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col cols="8"> <b> Balance Claim </b> </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="BalanceClaim === 'claimed'" color="success" large>mdi-check-circle</v-icon>
                        <v-btn @click="addBalanceClaim" v-if="BalanceClaim === 'approved'" color="primary">Claim</v-btn>
                        <div v-if="BalanceClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
        <v-overlay absolute :value="chainDataLoading"
            ><v-progress-circular indeterminate size="64"></v-progress-circular
        ></v-overlay>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { claimTypes, serializeClaim } from '@/utils/claims'
import { getNewContract } from '@/utils/drizzle'
import IdentityContract from '@/contracts/IdentityContract.json'

// List of claims that are needed for a valid plant
const claimsOfPlants = [
    claimTypes.RealWorldPlantIdClaim,
    claimTypes.ExistenceClaim,
    claimTypes.MeteringClaim,
    claimTypes.BalanceClaim,
    claimTypes.LocationClaim,
    claimTypes.GenerationTypeClaim,
    claimTypes.MaxPowerGenerationClaim,
    claimTypes.MaxPowerConsumptionClaim,
]

export default {
    name: 'GenerationPlantCard',

    props: {
        // object loaded from json-server
        plant: {
            type: Object,
            required: false,
        },
        // 'generation' or 'consumption'
        plantType: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            // object data loaded from the blockchain
            chainData: {},
            chainDataLoading: false,
        }
    },

    // hook that executes on load
    created() {
        this.loadChainData()
    },

    methods: {
        /**
         * Loads claims of the given plant from the blockchain
         */
        loadChainData() {
            this.chainDataLoading = true

            // web3 Contract
            const identityContract = getNewContract(IdentityContract, this.plant.idcAddress)

            claimsOfPlants.forEach(async (claimType) => {
                // array of ids of claims of the given claimType (should have a length of 1)
                const claimIds = await identityContract.methods.getClaimIdsByTopic(claimType).call()

                if (claimIds.length) {
                    // load the claim for the first claimId in the list (multiple claims of the same type have the same ID anyways and the most recent claim will be returned)
                    // claim data will be serialized
                    const claim = await identityContract.methods.getClaim(claimIds[0]).call().then(serializeClaim)

                    // set the value [claimType]: claim
                    this.$set(this.chainData, claimType, claim)
                }

                // set loading to false
                if (claimsOfPlants.indexOf(claimType) === claimsOfPlants.length - 1) this.chainDataLoading = false
            })
        },

        /**
         * Returns status of the claim
         * Claim on chain -> 'claimed'
         * Signature in json-server -> 'approved'
         * no Signature -> 'waiting'
         * @param claimType: number
         */
        getStatus(claimType) {
            if (this.chainData[claimType]) return 'claimed'
            if (this.plant?.signatures[claimType]) return 'approved'
            else return 'waiting'
        },

        /**
         * Function that adds a claim to the plant
         * @param claimType: number
         * @param data: object depending on claimType
         * @param signature: signature from json-server
         * @param issuer: address of the signing identity contract
         */
        addClaim(claimType, data, signature, issuer) {
            // adds data that is shared by every claim
            const hexlifiedData = this.drizzleInstance.web3.utils.toHex({
                ...data,
                expiryDate: this.plant.expiryDate,
                startDate: this.plant.startDate,
                realWorldPlantId: this.plant.realWorldPlantId,
            })

            // web3 Contract
            const identityContract = getNewContract(IdentityContract, this.plant.idcAddress)

            // adds the claim
            identityContract.methods
                .addClaim(claimType, 1, issuer, signature, hexlifiedData, '')
                .send({ from: this.activeAccount })
                .then(() => {
                    //reload chain Data
                    this.loadChainData()
                })
        },

        /**
         * ======================================================================
         * Functions define the needed data for the respective claim and call this.addClaim with it
         */
        addExistenceClaim() {
            const data = {
                type: this.plantType,
                imgURL: this.plant.imgURL,
            }

            this.addClaim(
                claimTypes.ExistenceClaim,
                data,
                this.plant.signatures[claimTypes.ExistenceClaim].signature,
                this.plant.signatures[claimTypes.ExistenceClaim].issuer
            )
        },
        addGenerationTypeClaim() {
            const data = {
                plantType: this.plant.plantType,
            }

            this.addClaim(
                claimTypes.GenerationTypeClaim,
                data,
                this.plant.signatures[claimTypes.GenerationTypeClaim].signature,
                this.plant.signatures[claimTypes.GenerationTypeClaim].issuer
            )
        },
        addMaxPowerGenerationClaim() {
            const data = {
                maxGen: this.plant.maxGen,
            }

            this.addClaim(
                claimTypes.MaxPowerGenerationClaim,
                data,
                this.plant.signatures[claimTypes.MaxPowerGenerationClaim].signature,
                this.plant.signatures[claimTypes.MaxPowerGenerationClaim].issuer
            )
        },
        addMaxPowerConsumptionClaim() {
            const data = {
                maxCon: this.consumptionPlant.maxCon,
            }

            this.addClaim(
                claimTypes.MaxPowerConsumptionClaim,
                data,
                this.consumptionPlant.signatures[claimTypes.MaxPowerConsumptionClaim].signature,
                this.consumptionPlant.signatures[claimTypes.MaxPowerConsumptionClaim].issuer
            )
        },
        addLocationClaim() {
            const data = {
                lat: this.plant.lat,
                long: this.plant.long,
            }

            this.addClaim(
                claimTypes.LocationClaim,
                data,
                this.plant.signatures[claimTypes.LocationClaim].signature,
                this.plant.signatures[claimTypes.LocationClaim].issuer
            )
        },
        addMeteringClaim() {
            const data = {}

            this.addClaim(
                claimTypes.MeteringClaim,
                data,
                this.plant.signatures[claimTypes.MeteringClaim].signature,
                this.plant.signatures[claimTypes.MeteringClaim].issuer
            )
        },
        addBalanceClaim() {
            const data = {}

            this.addClaim(
                claimTypes.BalanceClaim,
                data,
                this.plant.signatures[claimTypes.BalanceClaim].signature,
                this.plant.signatures[claimTypes.BalanceClaim].issuer
            )
        },
        // ======================================================================
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),

        /**
         * ======================================================================
         * computed properties that show the chaindata or the json-server data as fallback
         */
        realWorldPlantId() {
            return (
                this.chainData[claimTypes.RealWorldPlantIdClaim]?.__data?.realWorldPlantId ||
                this.plant?.realWorldPlantId
            )
        },
        generationPlantType() {
            return this.chainData[claimTypes.GenerationTypeClaim]?.__data?.plantType || this.plant?.plantType
        },
        maxGen() {
            return this.chainData[claimTypes.MaxPowerGenerationClaim]?.__data?.maxGen || this.plant?.maxGen
        },
        maxCon() {
            return this.chainData[claimTypes.MaxPowerConsumptionClaim]?.__data?.maxCon || this.consumptionPlant?.maxCon
        },
        lat() {
            return this.chainData[claimTypes.LocationClaim]?.__data?.lat || this.plant?.lat
        },
        long() {
            return this.chainData[claimTypes.LocationClaim]?.__data?.long || this.plant?.long
        },
        expiryDate() {
            return new Date(
                this.chainData[claimTypes.RealWorldPlantIdClaim]?.__data.expiryDate * 1000 ||
                    this.plant.expiryDate * 1000
            ).toLocaleDateString()
        },
        // ======================================================================

        /**
         * ======================================================================
         * status of the respective Claims
         */
        MeteringClaim() {
            return this.getStatus(claimTypes.MeteringClaim)
        },
        BalanceClaim() {
            return this.getStatus(claimTypes.BalanceClaim)
        },
        MaxPowerGenerationClaim() {
            return this.getStatus(claimTypes.MaxPowerGenerationClaim)
        },
        MaxPowerConsumptionClaim() {
            return this.getStatus(claimTypes.MaxPowerConsumptionClaim)
        },
        ExistenceClaim() {
            return this.getStatus(claimTypes.ExistenceClaim)
        },
        GenerationTypeClaim() {
            return this.getStatus(claimTypes.GenerationTypeClaim)
        },
        LocationClaim() {
            return this.getStatus(claimTypes.LocationClaim)
        },
        //======================================================================
    },
}
</script>

<style></style>
