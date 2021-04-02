<template>
    <v-app v-if="isDrizzleInitialized">
        <v-app-bar app color="primary" dark>
            <v-container>
                <h5>Current Account: {{ activeAccount }}</h5>
            </v-container>
        </v-app-bar>

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

    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized']),
        ...mapGetters('accounts', ['activeAccount']),
    },
}
</script>
