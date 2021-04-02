<template>
    <v-app v-if="isDrizzleInitialized">
        <v-app-bar app color="primary" clipped-left dark>
            <v-app-bar-nav-icon @click="isNavDrawerOpen = !isNavDrawerOpen"></v-app-bar-nav-icon>
            <v-app-bar-title>
                {{ appTitle }}
            </v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="isNavDrawerOpen" clipped app>
            <v-list>
                <v-list-item v-for="navItem in navItems" :key="navItem.text" :to="navItem.to">{{
                    navItem.text
                }}</v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view />
            <v-snackbar v-model="isSnackbarVisible" color="info" :timeout="5000">
                {{ snackbarText }}
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'App',

    data: () => ({
        isSnackbarVisible: false,
        snackbarText: '',
        isNavDrawerOpen: true,
        navItems: [
            { to: '/', text: 'Home' },
            { to: '/claims', text: 'Claims' },
            { to: '/authorities', text: 'Authorities' },
            { to: '/identityContracts', text: 'Identity Contracts' },
        ],
    }),

    mounted() {
        this.$drizzleEvents.$on('drizzle/contractEvent', (payload) => {
            // if identity contract was created push it to the store
            if (payload.eventName === 'IdentityContractCreation') {
                this.$store.dispatch('identityContracts/addIdentityContract', payload.data)
                this.snackbarText = `New Identity Contract was added at address ${payload.data.idcAddress}`
                this.isSnackbarVisible = true
            }
        })
    },

    watch: {
        // initialize active account store when the active account changes
        activeAccount() {
            if (this.isDrizzleInitialized) this.$store.dispatch('currentUser/initActiveAccount')
        },
    },

    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized', 'drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),
        appTitle() {
            if (this.$store.state.currentUser.isMarketAuthority) {
                return 'Market Authority'
            } else if (this.$store.state.currentUser.isBalanceAuthority) {
                return 'Balance Authority'
            } else if (this.$store.state.currentUser.isMeteringAuthority) {
                return 'Metering Authority'
            } else if (this.$store.state.currentUser.isPhysicalAssetAuthority) {
                return 'Physical Asset Authority'
            } else return ''
        },
    },
}
</script>
