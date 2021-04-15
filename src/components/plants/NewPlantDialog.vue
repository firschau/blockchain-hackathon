<template>
    <v-card>
        <v-card-title>New {{ type === 'generation' ? 'Generation' : 'Consumption' }} Plant</v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Real World Plant ID" v-model="realWorldPlantId"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Image URL" v-model="imgURL"></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="type === 'generation'">
                        <v-select label="Plant Type" v-model="plantType" :items="plantTypes"></v-select>
                    </v-col>
                    <v-col cols="12" v-if="type === 'generation'">
                        <v-text-field label="Maximum Generation Capacity" v-model="maxGen" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="type === 'consumption'">
                        <v-text-field
                            label="Maximum Consumption Capacity"
                            v-model="maxCon"
                            type="number"
                        ></v-text-field>
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
            <v-btn color="primary" @click="createNewIdentityContract">
                Add {{ type === 'generation' ? 'Generation' : 'Consumption' }} Plant
            </v-btn>
        </v-card-actions>
        <v-overlay absolute :value="addNewPlantLoading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNewContract } from '@/utils/drizzle'
import { claimTypes } from '@/utils/claims'
import IdentityContract from '@/contracts/IdentityContract.json'

import DatePicker from '@/components/DatePicker.vue'

export default {
    name: 'NewPlantDialog',

    components: {
        DatePicker,
    },

    props: {
        // 'generation' or 'consumption'
        type: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            // subscription needed to unsubscribe after the component is destroyed
            identityContractCreationEventSubscription: null,
            realWorldPlantId: this.type === 'generation' ? 'bestGenerationPlantId' : 'bestConsumptionPlantId',
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
            maxCon: 150000000,
            lat: 0,
            long: 0,
            expiryDate: Date.now() + 24 * 60 * 60 * 1000 * 365 * 10,
            startDate: Date.now() / 1000,
            addNewPlantLoading: false,
        }
    },

    /**
     * Function called after the component is displayed
     */
    mounted() {
        // call addPlant whenever a new identity contract was created
        this.identityContractCreationEventSubscription = this.drizzleInstance.contracts.IdentityContractFactory.events.IdentityContractCreation(
            {},
            (error, payload) => {
                // only call addPlant if the owner of the created identity contract is the active account
                if (this.activeAccount === payload.returnValues.owner) this.addPlant(payload.returnValues.idcAddress)
            }
        )
    },

    /**
     * Function called when the component is destroyed
     */
    beforeDestroy() {
        // unsubscribe (if we wouldn't unsubscribe the addplant Method would be called more then once if the dialog was called multiple times)
        this.identityContractCreationEventSubscription.unsubscribe()
    },

    methods: {
        /**
         * Function that creates a new identity contract
         * that generation is catched by the event listener
         */
        createNewIdentityContract() {
            this.addNewPlantLoading = true
            this.drizzleInstance.contracts.IdentityContractFactory.methods
                .createIdentityContract()
                .send({ from: this.activeAccount })
        },

        /**
         * Function that first adds a claim to the given identity contract and then creates a new entry in the json-server
         * @param idcAddress: address of the identity contract that is supposed to represent the new plant
         */
        addPlant(idcAddress) {
            // web3 Contract
            const identityContract = getNewContract(IdentityContract, idcAddress)

            // Data for the claim
            const hexlifiedData = this.drizzleInstance.web3.utils.toHex({
                startDate: this.startDate,
                expiryDate: +new Date(this.expiryDate) / 1000,
                imgURL: this.imgURL,
                realWorldPlantId: this.realWorldPlantId,
            })

            // hashed data
            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                identityContract.options.address,
                claimTypes.RealWorldPlantIdClaim,
                hexlifiedData
            )

            // sign the data with the current active account
            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                // add the RealWorldPlantIdClaim with the signature
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
                        // add the new data to the json-server
                        let plant = {
                            owner: this.activeAccount,
                            idcAddress: identityContract.options.address,
                            realWorldPlantId: this.realWorldPlantId,
                            imgURL: this.imgURL,
                            lat: this.lat,
                            long: this.long,
                            expiryDate: this.expiryDate / 1000,
                            startDate: this.startDate / 1000,
                            signatures: {
                                [claimTypes.MeteringClaim]: null,
                                [claimTypes.BalanceClaim]: null,
                                [claimTypes.ExistenceClaim]: null,
                                [claimTypes.LocationClaim]: null,
                            },
                        }

                        if (this.type === 'generation') {
                            plant = {
                                ...plant,
                                maxGen: this.maxGen,
                                plantType: this.plantType,
                                signatures: {
                                    ...plant.signatures,
                                    [claimTypes.MaxPowerGenerationClaim]: null,
                                    [claimTypes.GenerationTypeClaim]: null,
                                },
                            }
                        } else if (this.type === 'consumption') {
                            plant = {
                                ...plant,
                                maxCon: this.maxCon,
                                signatures: {
                                    ...plant.signatures,
                                    [claimTypes.MaxPowerConsumptionClaim]: null,
                                },
                            }
                        }

                        fetch(`/api/${this.type}Plants`, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(plant),
                        }).then(() => {
                            // emit changes and close the dialog
                            this.$emit('plant-added', plant)
                            this.$emit('close')
                        })
                    })
            })
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>

<style></style>
