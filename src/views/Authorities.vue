<template>
    <v-container>
        <v-card>
            <v-card-title> Market Authority </v-card-title>
            <v-card-text class="pt-4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title> IdentityContract Address </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ drizzleInstance.contracts.IdentityContract.address }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-row>
                    <v-col> </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title> Balance Authorities </v-card-title>
            <v-card-text class="pt-4">
                <v-list v-if="identityContractsByClaimType[claimTypes.IsBalanceAuthority]">
                    <v-list-item
                        v-for="address in identityContractsByClaimType[claimTypes.IsBalanceAuthority]"
                        :key="address"
                    >
                        <v-list-item-content>
                            <v-list-item-title>IdentityContract Address</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ address }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title> Metering Authorities </v-card-title>
            <v-card-text class="pt-4">
                <v-list v-if="identityContractsByClaimType[claimTypes.IsMeteringAuthority]">
                    <v-list-item
                        v-for="address in identityContractsByClaimType[claimTypes.IsMeteringAuthority]"
                        :key="address"
                    >
                        <v-list-item-content>
                            <v-list-item-title>IdentityContract Address</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ address }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title> Physical Asset Authorities </v-card-title>
            <v-card-text class="pt-4">
                <v-list v-if="identityContractsByClaimType[claimTypes.IsPhysicalAssetAuthority]">
                    <v-list-item
                        v-for="address in identityContractsByClaimType[claimTypes.IsPhysicalAssetAuthority]"
                        :key="address"
                    >
                        <v-list-item-content>
                            <v-list-item-title>IdentityContract Address</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ address }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { getNewContract } from '../utils/drizzle'
import { claimTypes } from '../utils/claims'
import IdentityContract from '../contracts/IdentityContract.json'

export default {
    name: 'Authorities',

    data: () => ({
        claimTypes,
        identityContractsByClaimType: {},
    }),

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapState('identityContracts', ['identityContracts']),
    },

    watch: {
        identityContracts: {
            handler: function (val) {
                // identity contracts as web3 contract object
                const identityContracts = val.map((idc) => getNewContract(IdentityContract, idc.idcAddress))

                // foreach identity contract foreach claimtype
                identityContracts.forEach((identityContract) => {
                    for (const claimType of [
                        claimTypes.IsBalanceAuthority,
                        claimTypes.IsMeteringAuthority,
                        claimTypes.IsPhysicalAssetAuthority,
                    ]) {
                        // get ids of claims and add the identity contract addresses to the respective claim type if there are claims
                        identityContract.methods
                            .getClaimIdsByTopic(claimType)
                            .call()
                            .then((ids) => {
                                if (ids.length) {
                                    // push if there are existing identity contracts
                                    if (this.identityContractsByClaimType[claimType]) {
                                        this.identityContractsByClaimType[claimType].push(
                                            identityContract.options.address
                                        )
                                    }
                                    // set if there aren't existing identity contracts
                                    else {
                                        this.$set(this.identityContractsByClaimType, claimType, [
                                            identityContract.options.address,
                                        ])
                                    }
                                }
                            })
                    }
                })
            },
            // will be called on initial load
            immediate: true,
        },
    },
}
</script>

<style></style>
