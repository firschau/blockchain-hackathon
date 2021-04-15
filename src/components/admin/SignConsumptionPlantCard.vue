<template>
    <v-card>
        <div class="pa-1">
            <v-img src="@/assets/undraw_houses.svg" contain></v-img>
        </div>
        <v-divider />
        <v-card-text>
            <div>
                <b>Owner of the Plant:</b>
                {{ plant.owner.substr(0, 8) + '....' + plant.owner.substr(38, 4) }}
            </div>
            <v-row dense>
                <v-col cols="8">
                    <div>
                        <b>Expiry Date:</b>
                        {{ consumptionPlant.expiryDate }}
                    </div>
                    <div>
                        <b>Real World Plant Id:</b>
                        {{ consumptionPlant.realWorldPlantId }}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.ExistenceClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signExistenceClaim"
                            :disabled="!activeAccountIsPhysicalAssetAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8">
                    <span>
                        <b>Max Consumption Capacity:</b>
                        {{ consumptionPlant.maxCon }}
                    </span>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.MaxPowerConsumptionClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signMaxPowerConsumptionClaim"
                            :disabled="!activeAccountIsPhysicalAssetAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8">
                    <div>
                        <b>lat:</b>
                        {{ consumptionPlant.lat }}
                    </div>
                    <div>
                        <b>long:</b>
                        {{ consumptionPlant.long }}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.LocationClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signLocationClaim"
                            :disabled="!activeAccountIsPhysicalAssetAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8"> <b> Metering Claim </b> </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.MeteringClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signMeteringClaim"
                            :disabled="!activeAccountIsMeteringAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col cols="8"> <b> Balance Claim </b> </v-col>
                <v-col cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.BalanceClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signBalanceClaim"
                            :disabled="!activeAccountIsBalanceAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { claimTypes } from '@/utils/claims'

export default {
    name: 'SignConsumptionPlantCard',

    props: {
        // json-server data
        consumptionPlant: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            claimTypes,
            signatures: this.consumptionPlant.signatures,
        }
    },

    methods: {
        signExistenceClaim() {
            const data = {
                type: 'consumption',
                imgURL: this.consumptionPlant.imgURL,
                expiryDate: this.consumptionPlant.expiryDate,
                startDate: this.consumptionPlant.startDate,
                realWorldPlantId: this.consumptionPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.consumptionPlant.idcAddress,
                claimTypes.ExistenceClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.ExistenceClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/consumptionPlants/${this.consumptionPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.consumptionPlant, signatures: this.signatures }),
                })
            })
        },
        signMaxPowerConsumptionClaim() {
            const data = {
                maxCon: this.consumptionPlant.maxCon,
                expiryDate: this.consumptionPlant.expiryDate,
                startDate: this.consumptionPlant.startDate,
                realWorldPlantId: this.consumptionPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.consumptionPlant.idcAddress,
                claimTypes.MaxPowerConsumptionClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.MaxPowerConsumptionClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/consumptionPlants/${this.consumptionPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.consumptionPlant, signatures: this.signatures }),
                })
            })
        },
        signLocationClaim() {
            const data = {
                lat: this.consumptionPlant.lat,
                long: this.consumptionPlant.long,
                expiryDate: this.consumptionPlant.expiryDate,
                startDate: this.consumptionPlant.startDate,
                realWorldPlantId: this.consumptionPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.consumptionPlant.idcAddress,
                claimTypes.LocationClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.LocationClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/consumptionPlants/${this.consumptionPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.consumptionPlant, signatures: this.signatures }),
                })
            })
        },
        signMeteringClaim() {
            const data = {
                expiryDate: this.consumptionPlant.expiryDate,
                startDate: this.consumptionPlant.startDate,
                realWorldPlantId: this.consumptionPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.consumptionPlant.idcAddress,
                claimTypes.MeteringClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.MeteringClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/consumptionPlants/${this.consumptionPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.consumptionPlant, signatures: this.signatures }),
                })
            })
        },
        signBalanceClaim() {
            const data = {
                expiryDate: this.consumptionPlant.expiryDate,
                startDate: this.consumptionPlant.startDate,
                realWorldPlantId: this.consumptionPlant.realWorldPlantId,
            }

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.consumptionPlant.idcAddress,
                claimTypes.BalanceClaim,
                hexlifiedData
            )

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                this.signatures.BalanceClaim = {
                    signature,
                    issuer: this.activeAccountIdentityContracts[0].idcAddress,
                }

                fetch(`/api/consumptionPlants/${this.consumptionPlant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.consumptionPlant, signatures: this.signatures }),
                })
            })
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('identityContracts', [
            'activeAccountIdentityContracts',
            'activeAccountIsBalanceAuthority',
            'activeAccountIsMeteringAuthority',
            'activeAccountIsPhysicalAssetAuthority',
        ]),
    },
}
</script>

<style></style>
