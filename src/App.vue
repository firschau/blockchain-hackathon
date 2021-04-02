<template>
    <v-app v-if="isDrizzleInitialized">
        <v-app-bar app color="primary" dark> </v-app-bar>

        <v-navigation-drawer app>
            <v-list>
                <v-list-item
                    v-for="navItem in navItems"
                    :key="navItem.text"
                    :to="navItem.to"
                    >{{ navItem.text }}</v-list-item
                >
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'App',

    data: () => ({
        navItems: [
            { to: '/', text: 'Home' },
            { to: '/claims', text: 'Claims' },
            { to: '/authorities', text: 'Authorities' },
            { to: '/identityContracts', text: 'Identity Contracts' },
        ],
    }),

    methods: {
        /**
         * updates the global isMarketAuthority state
         */
        updateIsMarketAuthority() {
            // get the owner of the market authority identity contract
            this.drizzleInstance.contracts.IdentityContract.methods
                .owner()
                .call()
                .then((owner) => {
                    // check if the the active account is the owner of the market authority identity contract
                    const isMarketAuthority = owner === this.activeAccount

                    // set the global state
                    this.$store.dispatch(
                        'currentUser/setIsMarketAuthority',
                        isMarketAuthority
                    )
                })
        },
    },

    watch: {
        // call updateIsMarketAuthority when drizzle is initialized
        isDrizzleInitialized(val) {
            if (val) {
                this.updateIsMarketAuthority()
            }
        },

        // call updateIsMarketAuthority again when the active account changes
        activeAccount() {
            this.updateIsMarketAuthority()
        },
    },

    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized', 'drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>
