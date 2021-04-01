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
        <v-card
            v-for="[claimTypeName, claimTypeId] in Object.entries(claimTypes)"
            :key="claimTypeId"
            class="mt-4"
        >
            <v-card-title>
                <h2>{{ claimTypeName }}</h2>
            </v-card-title>
            <v-card-text>
                <v-list v-if="identityContractsByClaimType[claimTypeName]">
                    <v-list-item
                        v-for="address in identityContractsByClaimType[
                            claimTypeName
                        ]"
                        :key="address"
                    >
                        {{ address }}
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import { getNewContract } from '../utils/drizzle'
import { claimTypes } from '../utils/claims'
import IdentityContractFactory from '../contracts/IdentityContractFactory.json'
import IdentityContract from '../contracts/IdentityContract.json'

export default {
    name: 'Authorities',

    data: () => ({
        identityContracts: [],
        claimTypes,
        identityContractsByClaimType: {},
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

                const identityContractAddresses = events.map(
                    (event) => event.returnValues.idcAddress
                )

                const identityContracts = identityContractAddresses.map(
                    (address) => getNewContract(IdentityContract, address)
                )

                identityContracts.forEach((identityContract) => {
                    console.log(identityContract)
                    for (const [claimTypeName, claimTypeId] of Object.entries(
                        this.claimTypes
                    )) {
                        identityContract.methods
                            .getClaimIdsByTopic(claimTypeId)
                            .call()
                            .then((ids) => {
                                if (ids.length) {
                                    if (
                                        this.identityContractsByClaimType[
                                            claimTypeName
                                        ]
                                    ) {
                                        this.identityContractsByClaimType[
                                            claimTypeName
                                        ].push(identityContract.options.address)
                                    } else {
                                        this.$set(
                                            this.identityContractsByClaimType,
                                            claimTypeName,
                                            [identityContract.options.address]
                                        )
                                    }
                                }
                            })
                    }
                })
            })
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>

<style></style>
