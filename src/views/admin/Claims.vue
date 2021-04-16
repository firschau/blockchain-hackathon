<template>
    <v-container>
        <v-card>
            <v-card-title>Add new Authority Claim</v-card-title>
            <v-card-text>
                <v-autocomplete
                    v-model="identityContract"
                    :items="identityContracts"
                    item-text="idcAddress"
                    return-object
                    label="Identity Contracts"
                >
                </v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    @click="isAddClaimDialogOpen = true"
                    :disabled="!identityContract"
                    class="white--text"
                    color="primary"
                >
                    addClaim
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="isAddClaimDialogOpen" width="700">
            <v-card>
                <v-card-title class="text-h5">
                    Add Claim to
                    {{ identityContract ? identityContract.idcAddress : '' }}
                </v-card-title>
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col>
                            <v-select
                                label="Claim Type"
                                :items="claimTypes"
                                item-text="name"
                                item-value="value"
                                v-model="selectedClaimType"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row v-if="selectedClaimType">
                        <v-col>
                            <date-picker v-model="formData.expiryDate" label="Expiration Date" />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="isAddClaimDialogOpen = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn @click="addClaim" class="white--text" color="primary"> Add Claim </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { claimTypes, claimTypeToName } from '@/utils/claims'
import { getNewContract } from '@/utils/drizzle'
import IdentityContract from '@/contracts/IdentityContract.json'

import DatePicker from '@/components/DatePicker'

export default {
    name: 'Claims',

    components: {
        DatePicker,
    },

    data() {
        return {
            isAddClaimDialogOpen: false,
            identityContract: null,
            selectedClaimType: null,
            isDatePickerOpen: false,
            formData: {
                expiryDate: +Date.now() + 24 * 60 * 60 * 1000 * 365 * 10,
                startDate: Date.now(),
            },
            claimTypes: [
                {
                    name: claimTypeToName(claimTypes.IsBalanceAuthority),
                    value: claimTypes.IsBalanceAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.IsMeteringAuthority),
                    value: claimTypes.IsMeteringAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.IsPhysicalAssetAuthority),
                    value: claimTypes.IsPhysicalAssetAuthority,
                },
            ],
        }
    },

    methods: {
        claimTypeToName,
        addClaim() {
            // data for the claim
            let data = {
                expiryDate: this.formData.expiryDate / 1000,
                startDate: this.formData.startDate / 1000,
            }

            // identity contract that gets the claim
            let targetAddress = this.identityContract.idcAddress

            // target Identity Contract as web3 Contract Object
            let targetIdentityContract = getNewContract(IdentityContract, targetAddress)

            // takes the users first activeAccount Identity Contract as issuer
            // won't work if the user has multiple identity contracts
            const issuerAddress = this.drizzleInstance.contracts.IdentityContract.address

            const hexlifiedData = this.drizzleInstance.web3.utils.toHex(data)

            const hashToSign = this.drizzleInstance.web3.utils.soliditySha3(
                targetAddress,
                this.selectedClaimType,
                hexlifiedData
            )

            // sign the data, then add the claim
            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                targetIdentityContract.methods
                    .addClaim(this.selectedClaimType, 1, issuerAddress, signature, hexlifiedData, '')
                    .send({ from: this.activeAccount })
            })
        },
    },

    computed: {
        ...mapState('identityContracts', ['identityContracts']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
