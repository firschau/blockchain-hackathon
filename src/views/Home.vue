<template>
    <v-container>
        <VBtn @click="addClaim"> addClaim </VBtn>
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

            identityContract.methods
                .marketAuthority()
                .call()
                .then((response) => console.log(response))
        },
        addClaim() {
            addClaim('0x6ea820f77c30c9e9fa602841fba4923b18ff22f8', 10030, {
                q: 'ab',
                expiryDate: 7721975,
                startDate: 67219751,
            })
            console.log(drizzle.contracts)
        },
        isRegisteredIdentityContract() {
            const physicalAssetAuthorityIdentityContract = getNewContract(
                IdentityContract,
                '0x6ea820f77c30c9e9fa602841fba4923b18ff22f8'
            )

            physicalAssetAuthorityIdentityContract.methods
                .getClaim(
                    '40663254270200377111277385912022913925533123874160792033802638483746649929577'
                )
                .call()
                .then((response) => console.log(response))
        },
    },

    computed: {
        ...mapGetters('drizzle', ['drizzleInstance']),
    },
}
</script>
