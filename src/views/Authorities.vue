<template>
    <v-container>
        <v-card>
            <v-card-title> Market Authority </v-card-title>
            <v-card-text class="pt-4">
                <v-list v-if="identityContracts.length">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title> IdentityContract Address </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ identityContracts[0].idcAddress }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title> Balance Authorities </v-card-title>
            <v-card-text class="pt-4">
                <v-list>
                    <v-list-item v-for="balanceAuthority in balanceAuthorities" :key="balanceAuthority.idcAddress">
                        <v-list-item-content>
                            <v-list-item-title>IdentityContract Address</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ balanceAuthority.idcAddress }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title> Metering Authorities </v-card-title>
            <v-card-text class="pt-4">
                <v-list>
                    <v-list-item v-for="meteringAuthority in meteringAuthorities" :key="meteringAuthority.idcAddress">
                        <v-list-item-content>
                            <v-list-item-title>IdentityContract Address</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ meteringAuthority.idcAddress }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title> Physical Asset Authorities </v-card-title>
            <v-card-text class="pt-4">
                <v-list>
                    <v-list-item
                        v-for="physicalAssetAuthority in physicalAssetAuthorities"
                        :key="physicalAssetAuthority.idcAddress"
                    >
                        <v-list-item-content>
                            <v-list-item-title>IdentityContract Address</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ physicalAssetAuthority.idcAddress }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

import { claimTypes } from '../utils/claims'

export default {
    name: 'Authorities',

    computed: {
        ...mapState('identityContracts', ['identityContracts']),
        balanceAuthorities() {
            return this.identityContracts.filter((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsBalanceAuthority)
            )
        },
        meteringAuthorities() {
            return this.identityContracts.filter((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsMeteringAuthority)
            )
        },
        physicalAssetAuthorities() {
            return this.identityContracts.filter((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsPhysicalAssetAuthority)
            )
        },
    },
}
</script>

<style></style>
