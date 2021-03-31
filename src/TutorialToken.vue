<template>
    <div v-if="isDrizzleInitialized">
        <drizzle-contract
            contractName="TutorialToken"
            method="totalSupply"
            label="Total"
        />
        <drizzle-contract
            contractName="TutorialToken"
            method="symbol"
            label="Symbol"
        />
        <drizzle-contract
            contractName="TutorialToken"
            method="balanceOf"
            label="Your Balance"
            :methodArgs="accounts"
        />

        <drizzle-contract-form
            contractName="TutorialToken"
            method="transfer"
            :placeholders="placeholders"
        />

        <drizzle-contract-form
            contractName="IdentityContractFactory"
            method="createIdentityContract"
        />

        <drizzle-contract-form
            contractName="IdentityContractFactory"
            method="isRegisteredIdentityContract"
        />

        <button @click="isRegisteredIdentityContract">isContract</button>
        <div>{{ contractInstances }}</div>
    </div>

    <div v-else>Loading...</div>
</template>

<script>
import { mapGetters } from 'vuex'

import SimpleStorage from './contracts/SimpleStorage.json'

export default {
    name: 'TutorialToken',
    methods: {
        isRegisteredIdentityContract() {
            const dataKey = this.drizzleInstance.contracts.IdentityContractFactory.methods[
                'isRegisteredIdentityContract'
            ].cacheCall('0x3b3C968C89018579a911d517112b947bA9BD0F01')

            console.log(
                this.drizzleInstance.contracts.IdentityContract.events.ContractCreated()
            )

            const contract = new this.drizzleInstance.web3.eth.Contract(
                SimpleStorage.abi,
                '0x88cdE48296183b62383A605587E5dAeF391Ff668'
            )

            contract
                .getPastEvents('allEvents')
                .then((data) => console.log(data))

            console.log(
                this.drizzleInstance.store.getState().contracts
                    .IdentityContractFactory.isRegisteredIdentityContract[
                    dataKey
                ]
            )

            // this.drizzle.drizzleInstance.contracts.IdentityContractFactory.isRegisteredIdentityContract(
            //   '0x3b3C968C89018579a911d517112b947bA9BD0F01'
            // ).cacheCall()
        },
    },
    computed: {
        ...mapGetters('accounts', ['activeAccount', 'activeBalance']),
        ...mapGetters('drizzle', ['isDrizzleInitialized', 'drizzleInstance']),
        ...mapGetters('contracts', ['contractInstances']),

        accounts() {
            return [this.activeAccount]
        },

        placeholders() {
            return ['To Address', 'Amount to Send']
        },
    },
}
</script>

<style></style>
