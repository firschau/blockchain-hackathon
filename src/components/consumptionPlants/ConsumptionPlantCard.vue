<template>
    <v-card>
        <div class="pa-1">
            <v-img src="@/assets/undraw_houses.svg" contain></v-img>
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
                        <b>Max Consumption Capacity:</b>
                        {{ maxCon }}
                    </span>
                </v-col>
                <v-col cols="4">
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

const claimsOfConsumptionPlants = [
    claimTypes.RealWorldPlantIdClaim,
    claimTypes.ExistenceClaim,
    claimTypes.MeteringClaim,
    claimTypes.BalanceClaim,
    claimTypes.LocationClaim,
    claimTypes.MaxPowerConsumptionClaim,
]

export default {
    name: 'ConsumptionPlantCard',

    props: {
        consumptionPlant: {
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
            const identityContract = getNewContract(IdentityContract, this.consumptionPlant.idcAddress)

            claimsOfConsumptionPlants.forEach(async (claimType) => {
                const claimIds = await identityContract.methods.getClaimIdsByTopic(claimType).call()
                claimIds.forEach(async (claimId) => {
                    const claim = await identityContract.methods.getClaim(claimId).call().then(serializeClaim)

                    this.$set(this.chainData, claimType, claim)
                })
                if (claimsOfConsumptionPlants.indexOf(claimType) === claimsOfConsumptionPlants.length - 1)
                    this.chainDataLoaded = true
            })
        },
        getStatus(claimType) {
            if (this.chainData[claimTypes[claimType]]) return 'claimed'
            if (this.consumptionPlant?.signatures[claimType]) return 'approved'
            else return 'waiting'
        },
        addExistenceClaim() {
            const data = {
                type: 'consumption',
                imgURL: this.consumptionPlant.imgURL,
            }

            this.addClaim(
                claimTypes.ExistenceClaim,
                data,
                this.consumptionPlant.signatures['ExistenceClaim'].signature,
                this.consumptionPlant.signatures['ExistenceClaim'].issuer
            )
        },
        addConsumptionTypeClaim() {
            const data = {
                plantType: this.consumptionPlant.plantType,
            }

            this.addClaim(
                claimTypes.ConsumptionTypeClaim,
                data,
                this.consumptionPlant.signatures['ConsumptionTypeClaim'].signature,
                this.consumptionPlant.signatures['ConsumptionTypeClaim'].issuer
            )
        },
        addMaxPowerConsumptionClaim() {
            const data = {
                maxCon: this.consumptionPlant.maxCon,
            }

            this.addClaim(
                claimTypes.MaxPowerConsumptionClaim,
                data,
                this.consumptionPlant.signatures['MaxPowerConsumptionClaim'].signature,
                this.consumptionPlant.signatures['MaxPowerConsumptionClaim'].issuer
            )
        },
        addLocationClaim() {
            const data = {
                lat: this.consumptionPlant.lat,
                long: this.consumptionPlant.long,
            }

            this.addClaim(
                claimTypes.LocationClaim,
                data,
                this.consumptionPlant.signatures['LocationClaim'].signature,
                this.consumptionPlant.signatures['LocationClaim'].issuer
            )
        },
        addMeteringClaim() {
            const data = {}

            this.addClaim(
                claimTypes.MeteringClaim,
                data,
                this.consumptionPlant.signatures['MeteringClaim'].signature,
                this.consumptionPlant.signatures['MeteringClaim'].issuer
            )
        },
        addBalanceClaim() {
            const data = {}

            this.addClaim(
                claimTypes.BalanceClaim,
                data,
                this.consumptionPlant.signatures['BalanceClaim'].signature,
                this.consumptionPlant.signatures['BalanceClaim'].issuer
            )
        },
        addClaim(claimType, data, signature, issuer) {
            const hexlifiedData = this.drizzleInstance.web3.utils.toHex({
                ...data,
                expiryDate: this.consumptionPlant.expiryDate,
                startDate: this.consumptionPlant.startDate,
                realWorldPlantId: this.consumptionPlant.realWorldPlantId,
            })

            const identityContract = getNewContract(IdentityContract, this.consumptionPlant.idcAddress)

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
                this.consumptionPlant?.realWorldPlantId
            )
        },
        maxCon() {
            return this.chainData[claimTypes.MaxPowerConsumptionClaim]?.__data?.maxCon || this.consumptionPlant?.maxCon
        },
        lat() {
            return this.chainData[claimTypes.LocationClaim]?.__data?.lat || this.consumptionPlant?.lat
        },
        long() {
            return this.chainData[claimTypes.LocationClaim]?.__data?.long || this.consumptionPlant?.long
        },
        expiryDate() {
            return new Date(
                this.chainData[claimTypes.RealWorldPlantIdClaim]?.__data.expiryDate * 1000 ||
                    this.consumptionPlant.expiryDate * 1000
            ).toLocaleDateString()
        },
        MeteringClaim() {
            return this.getStatus('MeteringClaim')
        },
        BalanceClaim() {
            return this.getStatus('BalanceClaim')
        },
        MaxPowerConsumptionClaim() {
            return this.getStatus('MaxPowerConsumptionClaim')
        },
        ExistenceClaim() {
            return this.getStatus('ExistenceClaim')
        },
        ConsumptionTypeClaim() {
            return this.getStatus('ConsumptionTypeClaim')
        },
        LocationClaim() {
            return this.getStatus('LocationClaim')
        },
    },
}
</script>

<style></style>
