<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h2>My Identity Contracts</h2>
                <v-spacer />
                <v-btn
                    @click="createNew"
                    color="darkblueshade"
                    class="white--text"
                    :disabled="!!activeAccountIdentityContracts.length"
                >
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
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'IdentityContracts',

    created() {
        // add Market Authority Identity Contract
        this.drizzleInstance.contracts.IdentityContract.methods
            .owner()
            .call()
            .then((owner) => {
                this.identityContracts.push({
                    idcAddress: this.drizzleInstance.contracts.IdentityContract.address,
                    owner,
                })
            })
    },

    methods: {
        createNew() {
            this.drizzleInstance.contracts.IdentityContractFactory.methods.createIdentityContract().send()
        },
    },

    computed: {
        ...mapState('identityContracts', ['identityContracts']),
        ...mapGetters('identityContracts', ['activeAccountIdentityContracts']),
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>

<style></style>
