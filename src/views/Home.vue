<template>
    <v-container>
        <v-row class="text-center">
            <v-col justify="center">
                <h1 style="margin-top: 30px">
                    BLOCKCHAIN-BASED <br />
                    ENERGY MARKETS.
                </h1>
                <p>POWERED BY</p>
                <img :src="require('../assets/ethereum.svg')" alt="Ethereum Logo" width="40" />
                <p>
                    This app provides a first prototype of a blockchain-based<br />energy market, leveraging the EnBW
                    B2E2 architecture. <br />
                    *Hier könnte eine ausführlichere Beschreibung rein*
                </p>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <v-col justify="center">
                <a
                    style="margin: 20px"
                    target="_blank"
                    href="https://it-architecture.enbw.com/whitepaper-energy-token-model/"
                    >B2E2 Whitepaper</a
                >
                <a
                    style="margin: 20px"
                    target="_blank"
                    href="https://it-architecture.enbw.com/energy-token-model-smart-contract-code/"
                    >B2E2 Repository</a
                >
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Home',
}
</script>
