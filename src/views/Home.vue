<template>
    <v-container>
        <v-row class="text-center">
            <v-col justify="center">
                <h1 style="margin: 30px">
                    BLOCKCHAIN-BASED <br />
                    ENERGY MARKETS.
                </h1>
                <p>POWERED BY</p>
                <img :src="require('../assets/ethereum.svg')" alt="Ethereum Logo" width="40" />
                <p align="justify" style="margin: 10px 100px 0px 100px">
                    This app provides a first prototype of a blockchain-based energy market, implementing the EnBW B2E2
                    architecture. It allows performing the setup of the various authorities proposed in the EnBW
                    whitepaper, creating new electricity consumption or generation plants and enables authorities to
                    provide claims to these plants. This prototypical implementation utilizes a local Ganache blockchain
                    and a JSON-Server. For detailed guidance please refer to the following resources:
                </p>
            </v-col>
        </v-row>
        <v-row class="text-center">
            <v-col justify="center">
                <a
                    style="margin: 20px"
                    target="_blank"
                    href="https://it-architecture.enbw.com/whitepaper-energy-token-model/"
                >
                    <b>EnBW B2E2 Whitepaper</b>
                </a>
                <a style="margin: 20px" target="_blank" href="https://git.scc.kit.edu/ukdqp/blockchain-hackathon-enbw">
                    <b>Git Repository</b>
                </a>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Home',
}
</script>
