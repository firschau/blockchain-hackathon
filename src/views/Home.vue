<template>
    <v-container>
        <drizzle-account units="Ether" :precision="2" />

        <drizzle-contract
            contractName="IdentityContract"
            method="marketAuthority"
            label="Market Authority"
        />

        <drizzle-contract-form
            contractName="IdentityContractFactory"
            method="createIdentityContract"
        />

        <v-btn @click="addContract"> addContract </v-btn>

        <drizzle-contract-form
            contractName="IdentityContractFactory"
            method="isRegisteredIdentityContract"
        />
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNewContract } from '../utils/drizzle'
import { addClaim } from '../utils/marketAuthority'
import IdentityContract from '../contracts/IdentityContract.json'

import { drizzle } from '../plugins/drizzleOptions'

export default {
    name: 'Home',

    methods: {
        getOwner() {
            const identityContract = getNewContract(
                IdentityContract,
                '0xd41001d59F8285a8DD630F069b37a991946D990B'
            )

            console.log(identityContract)

            identityContract.methods
                .marketAuthority()
                .call()
                .then((response) => console.log(response))
        },
        addContract() {
            addClaim('0x6ea820f77c30c9e9fa602841fba4923b18ff22f8', 10030, 0)
            console.log(drizzle.contracts)
            /**
            call(
                'IdentityContractFactory',
                'isRegisteredIdentityContract',
                '0x6ea820f77c30c9e9fa602841fba4923b18ff22f8'
            ).then((response) => console.log(response))
             * 
             */
        },
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>
