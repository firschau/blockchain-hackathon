<template>
    <v-app v-if="isDrizzleInitialized">
        <v-app-bar app color="primary" dark> </v-app-bar>

        <v-main>
            <v-container>
                <drizzle-account units="Ether" :precision="2" />

                <drizzle-contract
                    contractName="IdentityContract"
                    method="marketAuthority"
                    label="Market Authority"
                />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'App',

    data: () => ({
        //
    }),

    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized']),
    },
}
</script>
