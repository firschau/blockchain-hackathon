<template>
    <v-container>
        <v-autocomplete
            v-model="identityContract"
            :items="identityContracts"
            item-text="idcAddress"
            return-object
            label="Identity Contracts"
        >
        </v-autocomplete>

        <v-btn
            @click="isAddClaimDialogOpen = true"
            :disabled="!identityContract"
            color="primary"
        >
            addClaim
        </v-btn>

        <v-dialog v-model="isAddClaimDialogOpen" width="700">
            <v-card>
                <v-card-title>
                    Add Claim to
                    {{ identityContract ? identityContract.idcAddress : '' }}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-select
                                label="Claim Type"
                                :items="claimTypes"
                                v-model="selectedClaimType"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="expiresIn"
                                type="number"
                                label="Expires in..."
                                hint="days"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="isAddClaimDialogOpen = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn
                        @click="addClaim"
                        color="primary"
                        :disabled="!expiresIn || !selectedClaimType"
                    >
                        Add Claim
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" color="success" :timeout="5000">
            {{
                `${this.selectedClaimType} was added to ${
                    this.identityContract
                        ? this.identityContract.idcAddress
                        : ''
                }`
            }}
        </v-snackbar>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNewContract } from '../utils/drizzle'
import { addClaim, claimTypes } from '../utils/claims'
import IdentityContractFactory from '../contracts/IdentityContractFactory.json'

export default {
    name: 'Claims',

    data: () => ({
        snackbar: false,
        isAddClaimDialogOpen: false,
        identityContract: null,
        identityContracts: [],
        claimTypes: Object.keys(claimTypes),
        selectedClaimType: null,
        expiresIn: 365,
    }),

    created() {
        const identityContractFactory = getNewContract(
            IdentityContractFactory,
            this.drizzleInstance.contracts.IdentityContractFactory.address
        )

        identityContractFactory
            .getPastEvents('IdentityContractCreation', {
                fromBlock: 'earliest',
                toBlock: 'latest',
            })
            .then((events) => {
                this.identityContracts = events.map((event) => ({
                    idcAddress: event.returnValues.idcAddress,
                    owner: event.returnValues.owner,
                }))
            })
    },

    methods: {
        addClaim() {
            addClaim(
                this.identityContract.idcAddress,
                claimTypes[this.selectedClaimType],
                {
                    startDate: Date.now(),
                    expiryDate:
                        Date.now() + this.expiresIn * 24 * 60 * 60 * 1000,
                },
                this.drizzleInstance.contracts.IdentityContract.address
            ).then((response) => {
                console.log(response)
                this.snackbar = true
                this.isAddClaimDialogOpen = false
            })
        },
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>

<style></style>
