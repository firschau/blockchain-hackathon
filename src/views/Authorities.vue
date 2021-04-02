<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h2>Market Authority</h2>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        {{ drizzleInstance.contracts.IdentityContract.address }}
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-for="[claimTypeName, claimTypeId] in Object.entries(claimTypes)" :key="claimTypeId" class="mt-4">
            <v-card-title>
                <h2>{{ claimTypeName }}</h2>
            </v-card-title>
            <v-card-text>
                <v-list v-if="identityContractsByClaimType[claimTypeName]">
                    <v-list-item v-for="address in identityContractsByClaimType[claimTypeName]" :key="address">
                        {{ address }}
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
                    for (const [claimTypeName, claimTypeId] of Object.entries(this.claimTypes)) {
                        // get ids of claims and add the identity contract addresses to the respective claim type if there are claims
                        identityContract.methods
                            .getClaimIdsByTopic(claimTypeId)
                            .call()
                            .then((ids) => {
                                if (ids.length) {
                                    // push if there are existing identity contracts
                                    if (this.identityContractsByClaimType[claimTypeName]) {
                                        this.identityContractsByClaimType[claimTypeName].push(
                                            identityContract.options.address
                                        )
                                    }
                                    // set if there aren't existing identity contracts
                                    else {
                                        this.$set(this.identityContractsByClaimType, claimTypeName, [
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
