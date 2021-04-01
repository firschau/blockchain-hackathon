<template>
    <v-app v-if="isDrizzleInitialized">
        <v-app-bar app color="primary" dark> </v-app-bar>

        <v-navigation-drawer app>
            <v-list>
                <v-list-item to="/">home</v-list-item>
                <v-list-item to="/test">test</v-list-item>
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

    computed: {
        ...mapGetters('drizzle', ['isDrizzleInitialized']),
    },
}
</script>
