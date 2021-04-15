<template>
    <v-container>
        <v-card>
            <v-card-title>
                My Identity Contracts
                <v-spacer />
                <v-btn @click="createNewIdentityContract" color="primary" class="white--text">
                    Create New Identity Contract
                </v-btn>
            </v-card-title>
            <v-card-text class="pt-4">
                <v-row v-if="activeAccountIdentityContracts.length">
                    <v-col
                        v-for="identityContract in activeAccountIdentityContracts"
                        :key="identityContract.idcAddress"
                        cols="12"
                    >
                        <v-card>
                            <v-card-title class="text-h5"> Address: {{ identityContract.idcAddress }} </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col v-for="claim in claims[identityContract.idcAddress]" :key="claim.id">
                                        <v-sheet class="pa-2" outlined>
                                            <v-list>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title>ID</v-list-item-title>
                                                        <v-list-item-subtitle>{{ claim.id }}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Topic</v-list-item-title>
                                                        <v-list-item-subtitle>{{
                                                            claimTypeToName(+claim.__topic)
                                                        }}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Issuer</v-list-item-title>
                                                        <v-list-item-subtitle>{{
                                                            claim.__issuer
                                                        }}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title>Data</v-list-item-title>
                                                        <v-list-item-subtitle>{{ claim.__data }}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-img v-else src="../assets/undraw_contract.svg" class="mx-auto" contain height="500"></v-img>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import { claimTypes, serializeClaim, claimTypeToName } from '@/utils/claims'

export default {
    name: 'IdentityContracts',

    data() {
        return {
            claims: {},
        }
    },

    methods: {
        claimTypeToName,
        createNewIdentityContract() {
            this.drizzleInstance.contracts.IdentityContractFactory.methods
                .createIdentityContract()
                .send({ from: this.activeAccount })
        },
    },

    watch: {
        activeAccountIdentityContracts: {
            handler: function (val) {
                val.forEach((identityContract) => {
                    Object.values(claimTypes).forEach(async (claimType) => {
                        const claimIds = await identityContract.web3Contract.methods
                            .getClaimIdsByTopic(claimType)
                            .call()
                        claimIds.forEach((claimId) => {
                            identityContract.web3Contract.methods
                                .getClaim(claimId)
                                .call()
                                .then((claim) => {
                                    const serializedClaim = { ...serializeClaim(claim), id: claimId }
                                    if (this.claims[identityContract.idcAddress]) {
                                        this.claims[identityContract.idcAddress].push(serializedClaim)
                                    } else {
                                        this.$set(this.claims, identityContract.idcAddress, [serializedClaim])
                                    }
                                })
                        })
                    })
                })
            },
            immediate: true,
        },
    },

    computed: {
        ...mapGetters('identityContracts', ['activeAccountIdentityContracts']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>

<style></style>
