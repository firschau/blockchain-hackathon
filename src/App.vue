<template>
    <v-app v-if="isDrizzleInitialized" class="app">
        <v-app-bar app color="black" clipped-left dark>
            <v-app-bar-nav-icon @click="isNavDrawerOpen = !isNavDrawerOpen"></v-app-bar-nav-icon>
            <v-app-bar-title>
                <v-img :src="require('./assets/logo-enbw.png')" contain max-height="50" width="250" />
            </v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="isNavDrawerOpen" clipped app class="drawer">
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Active Account:</v-list-item-title>
                        <v-list-item-subtitle>{{ activeAccount }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Role:</v-list-item-title>
                        <v-list-item-subtitle>{{ appTitle }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider />
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
            let title = ''
            if (this.$store.state.currentUser.isMarketAuthority) {
                title += 'Market Authority '
            }
            if (this.$store.state.currentUser.isBalanceAuthority) {
                title += 'Balance Authority '
            }
            if (this.$store.state.currentUser.isMeteringAuthority) {
                title += 'Metering Authority '
            }
            if (this.$store.state.currentUser.isPhysicalAssetAuthority) {
                title += 'Physical Asset Authority '
            }
            return title
        },
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

#app {
    font-family: 'Poppins', sans-serif;
    background-image: url(assets/background.png);
    background-size: cover;
}

#drawer {
    background-color: lightgray;
}

.enbwLogo {
}
</style>
