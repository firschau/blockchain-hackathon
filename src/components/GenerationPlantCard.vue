<template>
    <v-card>
        <div class="pa-1">
            <v-img src="../assets/undraw_wind_turbine.svg" contain></v-img>
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
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { claimTypes } from '../utils/claims'
import { getNewContract } from '../utils/drizzle'
import IdentityContract from '../contracts/IdentityContract.json'

export default {
    name: 'GenerationPlantCard',

    props: {
        chainData: {
            type: Object,
            required: true,
        },
        apiData: {
            type: Object,
            required: false,
        },
    },

    data() {
        return {
            claimTypes,
            realWorldPlantId:
                this.chainData[claimTypes.RealWorldPlantIdClaim]?.__data?.realWorldPlantId ||
                this.apiData?.realWorldPlantId,
            plantType: this.chainData[claimTypes.GenerationTypeClaim]?.__data?.plantType || this.apiData?.plantType,
            maxGen: this.chainData[claimTypes.MaxPowerGenerationClaim]?.__data?.maxGen || this.apiData?.maxGen,
            lat: this.chainData[claimTypes.LocationClaim]?.__data?.lat || this.apiData?.lat,
            long: this.chainData[claimTypes.LocationClaim]?.__data?.long || this.apiData?.long,
            expiryDate: new Date(
                this.chainData[claimTypes.RealWorldPlantIdClaim].__data.expiryDate * 1000
            ).toLocaleDateString(),
            MeteringClaim: this.getStatus('MeteringClaim'),
            BalanceClaim: this.getStatus('BalanceClaim'),
            MaxPowerGenerationClaim: this.getStatus('MaxPowerGenerationClaim'),
            ExistenceClaim: this.getStatus('ExistenceClaim'),
            GenerationTypeClaim: this.getStatus('GenerationTypeClaim'),
            LocationClaim: this.getStatus('LocationClaim'),
        }
    },

    methods: {
        getStatus(claimType) {
            if (this.chainData[claimTypes[claimType]]) return 'claimed'
            if (this.apiData?.signatures[claimType]) return 'approved'
            else return 'waiting'
        },
        addExistenceClaim() {
            const data = {
                type: 'generation',
                imgURL: this.apiData.imgURL,
            }

            this.addClaim(
                claimTypes.ExistenceClaim,
                data,
                this.apiData.signatures['ExistenceClaim'].signature,
                this.apiData.signatures['ExistenceClaim'].issuer
            )
        },
        addGenerationTypeClaim() {
            const data = {
                plantType: this.apiData.plantType,
            }

            this.addClaim(
                claimTypes.GenerationTypeClaim,
                data,
                this.apiData.signatures['GenerationTypeClaim'].signature,
                this.apiData.signatures['GenerationTypeClaim'].issuer
            )
        },
        addMaxPowerGenerationClaim() {
            const data = {
                maxGen: this.apiData.maxGen,
            }

            this.addClaim(
                claimTypes.MaxPowerGenerationClaim,
                data,
                this.apiData.signatures['MaxPowerGenerationClaim'].signature,
                this.apiData.signatures['MaxPowerGenerationClaim'].issuer
            )
        },
        addLocationClaim() {
            const data = {
                lat: this.apiData.lat,
                long: this.apiData.long,
            }

            this.addClaim(
                claimTypes.LocationClaim,
                data,
                this.apiData.signatures['LocationClaim'].signature,
                this.apiData.signatures['LocationClaim'].issuer
            )
        },
        addMeteringClaim() {
            const data = {}

            this.addClaim(
                claimTypes.MeteringClaim,
                data,
                this.apiData.signatures['MeteringClaim'].signature,
                this.apiData.signatures['MeteringClaim'].issuer
            )
        },
        addBalanceClaim() {
            const data = {}

            this.addClaim(
                claimTypes.BalanceClaim,
                data,
                this.apiData.signatures['BalanceClaim'].signature,
                this.apiData.signatures['BalanceClaim'].issuer
            )
        },
        addClaim(claimType, data, signature, issuer) {
            const hexlifiedData = this.drizzleInstance.web3.utils.toHex({
                ...data,
                expiryDate: this.apiData.expiryDate,
                startDate: this.apiData.startDate,
                realWorldPlantId: this.apiData.realWorldPlantId,
            })

            const identityContract = getNewContract(IdentityContract, this.chainData.address)

            console.log(claimType)
            console.log(1)
            console.log(issuer)
            console.log(signature)
            console.log(hexlifiedData)

            identityContract.methods
                .addClaim(claimType, 1, issuer, signature, hexlifiedData, '')
                .send({ from: this.activeAccount })
                .then(() => {
                    location.reload()
                })
        },
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
