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
                        {{ generationPlant.expiryDate }}
                    </div>
                    <div>
                        <b>Real World Plant Id:</b>
                        {{ generationPlant.realWorldPlantId }}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures.ExistenceClaim" color="success" large> mdi-check-circle </v-icon>
                        <v-btn v-else @click="signExistenceClaim" :disabled="!isPhysicalAssetAuthority" color="primary">
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8">
                    <span>
                        <b>Plant Type:</b>
                        {{ generationPlant.plantType }}
                    </span>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures.GenerationTypeClaim" color="success" large> mdi-check-circle </v-icon>
                        <v-btn
                            v-else
                            @click="signGenerationTypeClaim"
                            :disabled="!isPhysicalAssetAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8">
                    <span>
                        <b>Max Generation Capacity:</b>
                        {{ generationPlant.maxGen }}
                    </span>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures.MaxPowerGenerationClaim" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signMaxPowerGenerationClaim"
                            :disabled="!isPhysicalAssetAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8">
                    <div>
                        <b>lat:</b>
                        {{ generationPlant.lat }}
                    </div>
                    <div>
                        <b>long:</b>
                        {{ generationPlant.long }}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures.LocationClaim" color="success" large> mdi-check-circle </v-icon>
                        <v-btn v-else @click="signLocationClaim" :disabled="!isPhysicalAssetAuthority" color="primary">
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8"> <b> Metering Claim </b> </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures.MeteringClaim" color="success" large> mdi-check-circle </v-icon>
                        <v-btn v-else @click="signMeteringClaim" :disabled="!isMeteringAuthority" color="primary">
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8"> <b> Balance Claim </b> </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures.BalanceClaim" color="success" large> mdi-check-circle </v-icon>
                        <v-btn v-else @click="signBalanceClaim" :disabled="!isBalanceAuthority" color="primary">
                            Sign
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { claimTypes } from '../utils/claims'

export default {
    name: 'NewGenerationPlantCard',

    props: {
        generationPlant: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            signatures: this.generationPlant.signatures,
        }
    },

    methods: {
        signExistenceClaim() {
            const data = {
                type: 'generation',
                imgURL: this.generationPlant.imgURL,
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.generationPlant.idcAddress,
                claimTypes.ExistenceClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.ExistenceClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/generationPlants/${this.generationPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.generationPlant, signatures: this.signatures }),
                })
            })
        },
        signGenerationTypeClaim() {
            const data = {
                plantType: this.generationPlant.plantType,
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.generationPlant.idcAddress,
                claimTypes.GenerationTypeClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.GenerationTypeClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/generationPlants/${this.generationPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.generationPlant, signatures: this.signatures }),
                })
            })
        },
        signMaxPowerGenerationClaim() {
            const data = {
                maxGen: this.generationPlant.maxGen,
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.generationPlant.idcAddress,
                claimTypes.MaxPowerGenerationClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.MaxPowerGenerationClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/generationPlants/${this.generationPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.generationPlant, signatures: this.signatures }),
                })
            })
        },
        signLocationClaim() {
            const data = {
                lat: this.generationPlant.lat,
                long: this.generationPlant.long,
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.generationPlant.idcAddress,
                claimTypes.LocationClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.LocationClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/generationPlants/${this.generationPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.generationPlant, signatures: this.signatures }),
                })
            })
        },
        signMeteringClaim() {
            const data = {
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.generationPlant.idcAddress,
                claimTypes.MeteringClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.MeteringClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/generationPlants/${this.generationPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.generationPlant, signatures: this.signatures }),
                })
            })
        },
        signBalanceClaim() {
            const data = {
                expiryDate: this.generationPlant.expiryDate,
                startDate: this.generationPlant.startDate,
                realWorldPlantId: this.generationPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.generationPlant.idcAddress,
                claimTypes.BalanceClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.BalanceClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/generationPlants/${this.generationPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.generationPlant, signatures: this.signatures }),
                })
            })
        },
    },

    computed: {
        ...mapState('currentUser', ['isBalanceAuthority', 'isMeteringAuthority', 'isPhysicalAssetAuthority']),
        ...mapGetters('accounts', ['activeAccount']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('identityContracts', ['activeAccountIdentityContracts']),
    },
}
</script>

<style></style>
