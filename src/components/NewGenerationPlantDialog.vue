<template>
    <v-card>
        <v-card-title>New Generation Plant</v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Real World Plant ID" v-model="realWorldPlantId"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Image URL" v-model="imgURL"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select label="Plant Type" v-model="plantType" :items="plantTypes"></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Maximum Generation Capacity" v-model="maxGen" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Latitude" v-model="lat" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Longitude" v-model="long" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <date-picker v-model="expiryDate" label="Expiry Data" />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="$emit('close')">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="createNewIdentityContract">Add Generation Plant</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNewContract } from '../utils/drizzle'
import { claimTypes } from '../utils/claims'
import IdentityContract from '../contracts/IdentityContract.json'

import DatePicker from './DatePicker.vue'

export default {
    name: 'NewGenerationPlantDialog',

    components: {
        DatePicker,
    },

    data() {
        return {
            realWorldPlantId: 'bestPlantId',
            imgURL: '',
            plantType: '',
            plantTypes: [
                'Photovoltaic',
                'HydroelectricPowerPlant',
                'WindTurbine',
                'NuclearPowerPlant',
                'Coal-FiredPowerPlant',
            ],
            maxGen: 300000000,
            lat: 0,
            long: 0,
            expiryDate: Date.now() + 24 * 60 * 60 * 1000 * 365 * 10,
            startDate: Date.now() / 1000,
        }
    },

    mounted() {
        this.$drizzleEvents.$on('drizzle/contractEvent', (payload) => {
            // if identity contract was created try to add a generation Plant with it's address
            if (payload.eventName === 'IdentityContractCreation') {
                this.addGenerationPlant(payload.data.idcAddress)
            }
        })
    },

    methods: {
        createNewIdentityContract() {
            this.drizzleInstance.contracts.IdentityContractFactory.methods
                .createIdentityContract()
                .send({ from: this.activeAccount })
        },
        async addGenerationPlant(idcAddress) {
            const identityContract = getNewContract(IdentityContract, idcAddress)

            const owner = await identityContract.methods.owner().call()

            if (owner === this.activeAccount) {
                // Add Real World Plant Id Claim to the newly created Identity Contract

                const hexlifiedData = this.drizzleInstance.web3.utils.toHex({
                    startDate: this.startDate,
                    expiryDate: +new Date(this.expiryDate) / 1000,
                    imgURL: this.imgURL,
                    realWorldPlantId: this.realWorldPlantId,
                })

                const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                    identityContract.options.address,
                    claimTypes.RealWorldPlantIdClaim,
                    hexlifiedData
                )

                this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                    identityContract.methods
                        .addClaim(
                            claimTypes.RealWorldPlantIdClaim,
                            1,
                            identityContract.options.address,
                            signature,
                            hexlifiedData,
                            ''
                        )
                        .send({ from: this.activeAccount })
                        .then(() => {
                            fetch('/api/generationPlants', {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    owner: this.activeAccount,
                                    idcAddress: identityContract.options.address,
                                    realWorldPlantId: this.realWorldPlantId,
                                    imgURL: this.imgURL,
                                    plantType: this.plantType,
                                    maxGen: this.maxGen,
                                    lat: this.lat,
                                    long: this.long,
                                    expiryDate: this.expiryDate / 1000,
                                    startDate: this.startDate / 1000,
                                    signatures: {
                                        MeteringClaim: null,
                                        BalanceClaim: null,
                                        ExistenceClaim: null,
                                        GenerationTypeClaim: null,
                                        LocationClaim: null,
                                        MaxPowerGenerationClaim: null,
                                    },
                                }),
                            })
                        })
                })
            }
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>

<style></style>
