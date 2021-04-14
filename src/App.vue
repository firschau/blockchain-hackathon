<template>
    <v-app v-if="isDrizzleInitialized">
        <div id="bg-image"></div>
        <v-app-bar app color="black" clipped-left dark>
            <v-app-bar-nav-icon @click="isNavDrawerOpen = !isNavDrawerOpen"></v-app-bar-nav-icon>
            <v-app-bar-title>
                <v-img :src="require('./assets/logo-enbw.png')" contain max-height="50" width="250" />
            </v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="isNavDrawerOpen" clipped app>
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
                <v-list-item v-for="navItem in navItems" :key="navItem.text" :to="navItem.to">
                    {{ navItem.text }}
                </v-list-item>
                <v-divider v-if="isAdmin"></v-divider>
                <v-subheader v-if="isAdmin"> Admin </v-subheader>
                <v-list-item v-for="navItem in filteredAdminNavItems" :key="navItem.text" :to="navItem.to">
                    {{ navItem.text }}
                </v-list-item>
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
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'App',

    data() {
        return {
            isSnackbarVisible: false,
            snackbarText: '',
            isNavDrawerOpen: true,
            navItems: [
                { to: '/', text: 'Home' },
                { to: '/authorities', text: 'Market' },
                { to: '/identityContracts', text: 'Identity Contracts' },
                { to: '/generationPlants', text: 'Generation Plants' },
                { to: '/consumptionPlants', text: 'Consumtion Plants' },
            ],
            adminNavItems: [
                { to: '/claims', text: 'Add Authority', filter: () => this.isMarketAuthority },
                {
                    to: '/signGenerationPlants',
                    text: 'Sign Generation Plants',
                    filter: () => this.isBalanceAuthority || this.isMeteringAuthority || this.isPhysicalAssetAuthority,
                },
                {
                    to: '/signConsumptionPlants',
                    text: 'Sign Consumption Plants',
                    filter: () => this.isBalanceAuthority || this.isMeteringAuthority || this.isPhysicalAssetAuthority,
                },
            ],
        }
    },

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
            if (this.isDrizzleInitialized) {
                this.$store.dispatch('currentUser/initActiveAccount')
            }
        },
    },

    computed: {
        ...mapState('currentUser', [
            'isBalanceAuthority',
            'isMeteringAuthority',
            'isPhysicalAssetAuthority',
            'isMarketAuthority',
        ]),
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
        filteredAdminNavItems() {
            return this.adminNavItems.filter((navItem) => navItem.filter())
        },
        isAdmin() {
            return (
                this.isBalanceAuthority ||
                this.isMeteringAuthority ||
                this.isPhysicalAssetAuthority ||
                this.isMarketAuthority
            )
        },
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

#bg-image {
    background-image: url(assets/background.png);
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
}

#app {
    font-family: 'Poppins', sans-serif;
}

.v-card__title {
    font-size: 2.125rem !important;
}
</style>
