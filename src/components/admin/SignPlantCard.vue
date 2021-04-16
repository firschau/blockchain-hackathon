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
                        {{ plant.expiryDate }}
                    </div>
                    <div>
                        <b>Real World Plant Id:</b>
                        {{ plant.realWorldPlantId }}
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
                <v-col v-if="plantType === 'generation'" cols="8">
                    <span>
                        <b>Plant Type:</b>
                        {{ plant.plantType }}
                    </span>
                </v-col>
                <v-col v-if="plantType === 'generation'" cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.GenerationTypeClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signGenerationTypeClaim"
                            :disabled="!activeAccountIsPhysicalAssetAuthority"
                            color="primary"
                        >
                            Sign
                        </v-btn>
                    </div>
                </v-col>
                <v-col v-if="plantType === 'consumption'" cols="8">
                    <span>
                        <b>Max Consumption Capacity:</b>
                        {{ plant.maxCon }}
                    </span>
                </v-col>
                <v-col v-if="plantType === 'consumption'" cols="4">
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
                <v-col v-if="plantType === 'generation'" cols="8">
                    <span>
                        <b>Max Generation Capacity:</b>
                        {{ plant.maxGen }}
                    </span>
                </v-col>
                <v-col v-if="plantType === 'generation'" cols="4">
                    <div class="d-flex justify-center">
                        <v-icon v-if="signatures[claimTypes.MaxPowerGenerationClaim]" color="success" large>
                            mdi-check-circle
                        </v-icon>
                        <v-btn
                            v-else
                            @click="signMaxPowerGenerationClaim"
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
                        {{ plant.lat }}
                    </div>
                    <div>
                        <b>long:</b>
                        {{ plant.long }}
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
    name: 'NewGenerationPlantCard',

    props: {
        // json-server data
        plant: {
            type: Object,
            required: true,
        },
        // 'generation' or 'consumption'
        plantType: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            claimTypes,
            signatures: this.plant.signatures,
        }
    },

    methods: {
        /**
         * signs a claim and uploads that signature to the json-server
         * @param claimType type of the claim
         * @param claimData data of the respective claim
         * @param issuerAddress address of the identity contract of the active account with the needed authority claim
         */
        signClaim(claimType, claimData, issuerAddress) {
            // adds data needed by all claims
            const data = {
                ...claimData,
                expiryDate: this.plant.expiryDate,
                startDate: this.plant.startDate,
                realWorldPlantId: this.plant.realWorldPlantId,
            }

            // hex of data
            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            // hash of data to sign
            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                this.plant.idcAddress,
                claimType,
                hexlifiedData
            )

            // create a signature with the active account
            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                // update signatures
                this.signatures[claimType] = {
                    signature,
                    issuer: issuerAddress,
                }

                fetch(`/api/${this.plantType}Plants/${this.plant.id}`, {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...this.plant, signatures: this.signatures }),
                })
            })
        },

        // find the identity contract of the current user that has the physical asset authority claim and return its address
        getPhysicalAssetIdentityContractAddress() {
            return this.activeAccountIdentityContracts.find((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsPhysicalAssetAuthority)
            )?.idcAddress
        },

        // find the identity contract of the current user that has the balance authority claim and return its address
        getBalanceIdentityContractAddress() {
            return this.activeAccountIdentityContracts.find((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsBalanceAuthority)
            )?.idcAddress
        },

        // find the identity contract of the current user that has the metering authority claim and return its address
        getMeteringIdentityContractAddress() {
            return this.activeAccountIdentityContracts.find((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsMeteringAuthority)
            )?.idcAddress
        },

        /**
         * ======================================================================
         * Functions that set the needed data for a claim and call this.signClaim
         */
        signExistenceClaim() {
            const data = {
                type: this.plantType,
                imgURL: this.plant.imgURL,
            }

            this.signClaim(claimTypes.ExistenceClaim, data, this.getPhysicalAssetIdentityContractAddress())
        },
        signGenerationTypeClaim() {
            const data = {
                plantType: this.plant.plantType,
            }

            this.signClaim(claimTypes.GenerationTypeClaim, data, this.getPhysicalAssetIdentityContractAddress())
        },
        signMaxPowerGenerationClaim() {
            const data = {
                maxGen: this.plant.maxGen,
            }

            this.signClaim(claimTypes.MaxPowerGenerationClaim, data, this.getPhysicalAssetIdentityContractAddress())
        },
        signMaxPowerConsumptionClaim() {
            const data = {
                maxCon: this.plant.maxCon,
            }

            this.signClaim(claimTypes.MaxPowerConsumptionClaim, data, this.getPhysicalAssetIdentityContractAddress())
        },
        signLocationClaim() {
            const data = {
                lat: this.plant.lat,
                long: this.plant.long,
            }

            this.signClaim(claimTypes.LocationClaim, data, this.getPhysicalAssetIdentityContractAddress())
        },
        signMeteringClaim() {
            const data = {}

            this.signClaim(claimTypes.MeteringClaim, data, this.getMeteringIdentityContractAddress())
        },
        signBalanceClaim() {
            const data = {}

            this.signClaim(claimTypes.MeteringClaim, data, this.getBalanceIdentityContractAddress())
        },
        // ======================================================================
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
