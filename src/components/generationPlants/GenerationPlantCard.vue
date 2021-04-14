<template>
    <v-card>
        <div class="pa-1">
            <v-img src="@/assets/undraw_wind_turbine.svg" contain></v-img>
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
                <v-col cols="8">
                    <span>
                        <b>Plant Type:</b>
                        {{ plantType }}
                    </span>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="GenerationTypeClaim === 'claimed'" color="success" large>mdi-check-circle</v-icon>
                        <v-btn @click="addGenerationTypeClaim" v-if="GenerationTypeClaim === 'approved'" color="primary"
                            >Claim</v-btn
                        >
                        <div v-if="GenerationTypeClaim === 'waiting'">...waiting for approval</div>
                    </div>
                </v-col>
                <v-col cols="8">
                    <span>
                        <b>Max Generation Capacity:</b>
                        {{ maxGen }}
                    </span>
                </v-col>
                <v-col cols="4">
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
        <v-overlay absolute :value="!chainDataLoaded"
            ><v-progress-circular indeterminate size="64"></v-progress-circular
        ></v-overlay>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { claimTypes, serializeClaim } from '@/utils/claims'
import { getNewContract } from '@/utils/drizzle'
import IdentityContract from '@/contracts/IdentityContract.json'

const claimsOfGenerationPlants = [
    claimTypes.RealWorldPlantIdClaim,
    claimTypes.ExistenceClaim,
    claimTypes.MeteringClaim,
    claimTypes.BalanceClaim,
    claimTypes.LocationClaim,
    claimTypes.GenerationTypeClaim,
    claimTypes.MaxPowerGenerationClaim,
]

export default {
    name: 'GenerationPlantCard',

    props: {
        generationPlant: {
            type: Object,
            required: false,
        },
    },

    data() {
        return {
            chainData: {},
            chainDataLoaded: false,
        }
    },

    created() {
        this.loadChainData()
    },

    methods: {
        loadChainData() {
            this.chainDataLoaded = false
            const identityContract = getNewContract(IdentityContract, this.generationPlant.idcAddress)

            claimsOfGenerationPlants.forEach(async (claimType) => {
                const claimIds = await identityContract.methods.getClaimIdsByTopic(claimType).call()
                claimIds.forEach(async (claimId) => {
                    const claim = await identityContract.methods.getClaim(claimId).call().then(serializeClaim)

                    this.$set(this.chainData, claimType, claim)
                })
                if (claimsOfGenerationPlants.indexOf(claimType) === claimsOfGenerationPlants.length - 1)
                    this.chainDataLoaded = true
            })
        },
        getStatus(claimType) {
            if (this.chainData[claimTypes[claimType]]) return 'claimed'
            if (this.generationPlant?.signatures[claimType]) return 'approved'
            else return 'waiting'
        },
        addExistenceClaim() {
            const data = {
                type: 'generation',
                imgURL: this.generationPlant.imgURL,
            }

            this.addClaim(
                claimTypes.ExistenceClaim,
                data,
                this.generationPlant.signatures['ExistenceClaim'].signature,
                this.generationPlant.signatures['ExistenceClaim'].issuer
            )
        },
        addGenerationTypeClaim() {
            const data = {
                plantType: this.generationPlant.plantType,
            }

            this.addClaim(
                claimTypes.GenerationTypeClaim,
                data,
                this.generationPlant.signatures['GenerationTypeClaim'].signature,
                this.generationPlant.signatures['GenerationTypeClaim'].issuer
            )
        },
        addMaxPowerGenerationClaim() {
            const data = {
                maxGen: this.generationPlant.maxGen,
            }

            this.addClaim(
                claimTypes.MaxPowerGenerationClaim,
                data,
                this.generationPlant.signatures['MaxPowerGenerationClaim'].signature,
                this.generationPlant.signatures['MaxPowerGenerationClaim'].issuer
            )
        },
        addLocationClaim() {
            const data = {
                lat: this.generationPlant.lat,
                long: this.generationPlant.long,
            }

            this.addClaim(
                claimTypes.LocationClaim,
                data,
                this.generationPlant.signatures['LocationClaim'].signature,
                this.generationPlant.signatures['LocationClaim'].issuer
            )
        },
        addMeteringClaim() {
            const data = {}

            this.addClaim(
                claimTypes.MeteringClaim,
                data,
                this.generationPlant.signatures['MeteringClaim'].signature,
                this.generationPlant.signatures['MeteringClaim'].issuer
            )
        },
        addBalanceClaim() {
            const data = {}

            this.addClaim(
                claimTypes.BalanceClaim,
                data,
                this.generationPlant.signatures['BalanceClaim'].signature,
                this.generationPlant.signatures['BalanceClaim'].issuer
            )
        },
        addClaim(claimType, data, signature, issuer) {
            const hexlifiedData = this.drizzleInstance.web3.utils.toHex({
                ...data,
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            })

            const identityContract = getNewContract(IdentityContract, this.generationPlant.idcAddress)

            identityContract.methods
                .addClaim(claimType, 1, issuer, signature, hexlifiedData, '')
                .send({ from: this.activeAccount })
                .then(() => {
                    this.loadChainData()
                })
        },
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),
        realWorldPlantId() {
            return (
                this.chainData[claimTypes.RealWorldPlantIdClaim]?.__data?.realWorldPlantId ||
                this.generationPlant?.realWorldPlantId
            )
        },
        plantType() {
            return this.chainData[claimTypes.GenerationTypeClaim]?.__data?.plantType || this.generationPlant?.plantType
        },
        maxGen() {
            return this.chainData[claimTypes.MaxPowerGenerationClaim]?.__data?.maxGen || this.generationPlant?.maxGen
        },
        lat() {
            return this.chainData[claimTypes.LocationClaim]?.__data?.lat || this.generationPlant?.lat
        },
        long() {
            return this.chainData[claimTypes.LocationClaim]?.__data?.long || this.generationPlant?.long
        },
        expiryDate() {
            return new Date(
                this.chainData[claimTypes.RealWorldPlantIdClaim]?.__data.expiryDate * 1000 ||
                    this.generationPlant.expiryDate * 1000
            ).toLocaleDateString()
        },
        MeteringClaim() {
            return this.getStatus('MeteringClaim')
        },
        BalanceClaim() {
            return this.getStatus('BalanceClaim')
        },
        MaxPowerGenerationClaim() {
            return this.getStatus('MaxPowerGenerationClaim')
        },
        ExistenceClaim() {
            return this.getStatus('ExistenceClaim')
        },
        GenerationTypeClaim() {
            return this.getStatus('GenerationTypeClaim')
        },
        LocationClaim() {
            return this.getStatus('LocationClaim')
        },
    },
}
</script>

<style></style>
