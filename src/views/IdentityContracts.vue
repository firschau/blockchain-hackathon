<template>
    <v-container>
        <v-card>
            <v-card-title>
                <h2>My Identity Contracts</h2>
                <v-spacer />
                <v-btn @click="createNew" color="primary">
                    Create New Identity Contract
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item
                        v-for="identityContract in myIdentityContracts"
                        :key="identityContract.idcAddress"
                    >
                        {{ identityContract.idcAddress }}
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>

        <v-snackbar v-model="snackbar" color="success" :timeout="5000">
            {{ snackbarText }}
        </v-snackbar>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import IdentityContractFactory from '../contracts/IdentityContractFactory.json'

import { getNewContract } from '../utils/drizzle'

export default {
    name: 'IdentityContracts',

    data: () => ({
        snackbar: false,
        snackbarText: '',
        identityContracts: [],
    }),

    created() {
        // add Market Authority Identity Contract
        this.drizzleInstance.contracts.IdentityContract.methods
            .owner()
            .call()
            .then((owner) => {
                this.identityContracts.push({
                    idcAddress: this.drizzleInstance.contracts.IdentityContract
                        .address,
                    owner,
                })
            })

        this.loadIdentityContracts()
    },

    mounted() {
        this.$drizzleEvents.$on('drizzle/contractEvent', (payload) => {
            if (payload.eventName === 'IdentityContractCreation') {
                this.snackbarText = `New Identity Contract created at: ${payload.data.idcAddress}`
                this.identityContracts.push(payload.data)
                this.snackbar = true
            }
        })
    },

    methods: {
        createNew() {
            this.drizzleInstance.contracts.IdentityContractFactory.methods
                .createIdentityContract()
                .send()
                .then(console.log)
        },
        loadIdentityContracts() {
            this.identityContracts = []
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
                    this.identityContracts.push(
                        ...events.map((event) => ({
                            idcAddress: event.returnValues.idcAddress,
                            owner: event.returnValues.owner,
                        }))
                    )
                })
        },
    },

    computed: {
        ...mapGetters('accounts', ['activeAccount']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        myIdentityContracts() {
            console.log(this.activeAccount)
            return this.identityContracts.filter(
                (idc) => idc.owner === this.activeAccount
            )
        },
    },
}
</script>

<style></style>
