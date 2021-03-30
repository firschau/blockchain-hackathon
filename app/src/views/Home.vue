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

        <v-btn @click="isRegisteredIdentityContract"
            >isRegisteredIdentityContract</v-btn
        >

        <drizzle-contract-form
            contractName="IdentityContractFactory"
            method="isRegisteredIdentityContract"
        />
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNewContract, call } from '../utils/drizzle'
import IdentityContract from '../contracts/IdentityContract.json'

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
        isRegisteredIdentityContract() {
            call(
                'IdentityContractFactory',
                'isRegisteredIdentityContract',
                '0x165c206A24486C1829D41d0a30d3b5a19F7d0DBD'
            ).then((response) => console.log(response))
        },
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>
