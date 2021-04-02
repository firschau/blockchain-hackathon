<template>
    <v-container>
        <v-autocomplete
            v-model="identityContract"
            :items="identityContracts"
            item-text="idcAddress"
            return-object
            label="Identity Contracts"
        >
        </v-autocomplete>

        <v-btn @click="isAddClaimDialogOpen = true" :disabled="!identityContract" color="primary"> addClaim </v-btn>

        <v-dialog v-model="isAddClaimDialogOpen" width="700">
            <v-card>
                <v-card-title>
                    Add Claim to
                    {{ identityContract ? identityContract.idcAddress : '' }}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-select label="Claim Type" :items="claimTypes" v-model="selectedClaimType"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-menu
                                v-model="isDatePickerOpen"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="formattedDate"
                                        label="Expiration Date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="expirationDate"
                                    @input="isDatePickerOpen = false"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="isAddClaimDialogOpen = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn @click="addClaim" color="primary" :disabled="!expirationDate || !selectedClaimType">
                        Add Claim
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { addClaim, claimTypes } from '../utils/claims'

export default {
    name: 'Claims',

    data: () => ({
        isAddClaimDialogOpen: false,
        identityContract: null,
        claimTypes: Object.keys(claimTypes),
        selectedClaimType: null,
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365).toISOString().substring(0, 10),
        isDatePickerOpen: false,
    }),

    methods: {
        addClaim() {
            addClaim(
                this.identityContract.idcAddress,
                claimTypes[this.selectedClaimType],
                {
                    startDate: Date.now(),
                    expiryDate: +new Date(this.expirationDate),
                },
                this.drizzleInstance.contracts.IdentityContract.address
            )
        },
    },

    computed: {
        ...mapState('identityContracts', ['identityContracts']),
        ...mapGetters('drizzle', ['drizzleInstance']),
        // formated date to show in the date picker
        formattedDate() {
            return new Date(this.expirationDate).toLocaleDateString()
        },
    },
}
</script>

<style></style>
