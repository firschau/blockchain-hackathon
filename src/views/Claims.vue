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
                            <v-select
                                label="Claim Type"
                                :items="filteredClaimTypes"
                                item-text="name"
                                item-value="value"
                                v-model="selectedClaimType"
                            ></v-select>
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
                                    v-model="formData.expirationDate"
                                    @input="isDatePickerOpen = false"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row
                        v-if="
                            selectedClaimType === 10130 ||
                            selectedClaimType === 10050 ||
                            selectedClaimType === 10060 ||
                            selectedClaimType === 10070 ||
                            selectedClaimType === 10080 ||
                            selectedClaimType === 10040 ||
                            selectedClaimType === 10065
                        "
                    >
                        <v-col>
                            <v-text-field
                                label="Real World Plant Id"
                                v-model="formData.realWorldPlantId"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="selectedClaimType === 10060">
                        <v-col>
                            <v-text-field label="Type" v-model="formData.type"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="selectedClaimType === 10065">
                        <v-col>
                            <v-text-field label="Max Gen" v-model="formData.maxGen"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="selectedClaimType === 10140">
                        <v-col>
                            <v-text-field label="Max Con" v-model="formData.maxCon"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="isAddClaimDialogOpen = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn @click="addClaim" color="primary"> Add Claim </v-btn>
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

    data() {
        return {
            isAddClaimDialogOpen: false,
            identityContract: null,
            selectedClaimType: null,
            isDatePickerOpen: false,
            formData: {
                expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365).toISOString().substring(0, 10),
                startDate: Date.now(),
            },
            claimTypes: [
                {
                    name: 'Is Balance Authority Claim',
                    value: claimTypes.IsBalanceAuthority,
                    filter: () => this.isMarketAuthority,
                },
                {
                    name: 'Is Metering Authority Claim',
                    value: claimTypes.IsMeteringAuthority,
                    filter: () => this.isMarketAuthority,
                },
                {
                    name: 'Is Physical Asset Authority Claim',
                    value: claimTypes.IsPhysicalAssetAuthority,
                    filter: () => this.isMarketAuthority,
                },
                {
                    name: 'Metering Claim',
                    value: claimTypes.MeteringClaim,
                    filter: () => this.isMeteringAuthority,
                },
                {
                    name: 'Balance Claim',
                    value: claimTypes.BalanceClaim,
                    filter: () => this.isBalanceAuthority,
                },
                {
                    name: 'Existence Claim',
                    value: claimTypes.ExistenceClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
                {
                    name: 'Generation Type Claim',
                    value: claimTypes.GenerationTypeClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
                {
                    name: 'Location Claim',
                    value: claimTypes.LocationClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
            ],
        }
    },

    methods: {
        addClaim() {
            const data = this.formData

            data.expirationDate = +new Date(data.expirationDate)

            addClaim(
                this.identityContract.idcAddress,
                claimTypes[this.selectedClaimType],
                data,
                this.drizzleInstance.contracts.IdentityContract.address
            )
        },
    },

    computed: {
        ...mapState('identityContracts', ['identityContracts']),
        ...mapState('currentUser', [
            'isBalanceAuthority',
            'isMarketAuthority',
            'isMeteringAuthority',
            'isPhysicalAssetAuthority',
        ]),
        ...mapGetters('drizzle', ['drizzleInstance']),

        // formated date to show in the date picker
        formattedDate() {
            return new Date(this.expirationDate).toLocaleDateString()
        },

        // filtered claim types by active account
        filteredClaimTypes() {
            return this.claimTypes.filter((claimType) => {
                console.log(this.isMarketAuthority)
                console.log(claimType.filter())
                console.log(claimType.filter())
                return claimType.filter()
            })
        },
    },
}
</script>

<style></style>
