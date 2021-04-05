<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h2>My Identity Contracts</h2>
                <v-spacer />
                <v-btn @click="createNew" color="primary" :disabled="!!activeAccountIdentityContracts.length">
                    Create New Identity Contract
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item
                        v-for="identityContract in activeAccountIdentityContracts"
                        :key="identityContract.idcAddress"
                    >
                        {{ identityContract.idcAddress }}
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'IdentityContracts',

    methods: {
        createNew() {
            this.drizzleInstance.contracts.IdentityContractFactory.methods
                .createIdentityContract()
                .send({ from: this.activeAccount })
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
