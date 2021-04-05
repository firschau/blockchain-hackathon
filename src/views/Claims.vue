<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h4">My Claims</v-card-title>
            <v-card-text>
                <div v-for="idc in activeAccountIdentityContracts" :key="idc.idcAddress">
                    <v-divider class="mb-4" />
                    <h4 class="text-h5">Identity Contract: {{ idc.idcAddress }}</h4>
                    <v-row class="mt-2">
                        <v-col v-for="claim in idc.claims" :key="claim.id">
                            <v-sheet class="pa-2" outlined>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>ID</v-list-item-title>
                                            <v-list-item-subtitle>{{ claim.id }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>Topic</v-list-item-title>
                                            <v-list-item-subtitle>{{
                                                claimTypeToName(+claim.__topic)
                                            }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>Issuer</v-list-item-title>
                                            <v-list-item-subtitle>{{ claim.__issuer }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>Data</v-list-item-title>
                                            <v-list-item-subtitle>{{ hexToAscii(claim.__data) }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card>
        <v-card class="mt-4">
            <v-card-title class="text-h4">New Claims</v-card-title>
            <v-card-text>
                <v-autocomplete
                    v-model="identityContract"
                    :items="identityContracts"
                    item-text="idcAddress"
                    return-object
                    label="Identity Contracts"
                >
                </v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    @click="isAddClaimDialogOpen = true"
                    :disabled="!identityContract"
                    class="white--text"
                    color="darkblueshade"
                >
                    addClaim
                </v-btn>
            </v-card-actions>
        </v-card>

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
                    <v-row v-if="selectedClaimType">
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
                                    v-model="formData.expiryDate"
                                    @input="isDatePickerOpen = false"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row v-if="claimNeedsRealWorldPlantId(selectedClaimType)">
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
                    <v-btn @click="addClaim" class="white--text" color="darkblueshade"> Add Claim </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { claimTypes, claimTypeToName } from '../utils/claims'
import { getNewContract } from '../utils/drizzle'
import IdentityContract from '../contracts/IdentityContract.json'
import Distributor from '../contracts/Distributor.json'

export default {
    name: 'Claims',

    data() {
        return {
            isAddClaimDialogOpen: false,
            identityContract: null,
            selectedClaimType: null,
            isDatePickerOpen: false,
            formData: {
                expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365 * 10).toISOString().substring(0, 10),
                startDate: Date.now(),
                realWorldPlantId: 'bestPlantId',
                maxGen: 300000000,
                maxCon: 150000000,
                type: 'generation',
            },
            claimTypes: [
                {
                    name: claimTypeToName(claimTypes.IsBalanceAuthority),
                    value: claimTypes.IsBalanceAuthority,
                    filter: () => this.isMarketAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.IsMeteringAuthority),
                    value: claimTypes.IsMeteringAuthority,
                    filter: () => this.isMarketAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.IsPhysicalAssetAuthority),
                    value: claimTypes.IsPhysicalAssetAuthority,
                    filter: () => this.isMarketAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.MeteringClaim),
                    value: claimTypes.MeteringClaim,
                    filter: () => this.isMeteringAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.BalanceClaim),
                    value: claimTypes.BalanceClaim,
                    filter: () => this.isBalanceAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.ExistenceClaim),
                    value: claimTypes.ExistenceClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.GenerationTypeClaim),
                    value: claimTypes.GenerationTypeClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.LocationClaim),
                    value: claimTypes.LocationClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.AcceptedDistributorClaim),
                    value: claimTypes.AcceptedDistributorClaim,
                    filter: () => this.isBalanceAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.RealWorldPlantIdClaim),
                    value: claimTypes.RealWorldPlantIdClaim,
                    filter: () => true,
                },
                {
                    name: claimTypeToName(claimTypes.MaxPowerConsumptionClaim),
                    value: claimTypes.MaxPowerConsumptionClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
                {
                    name: claimTypeToName(claimTypes.MaxPowerGenerationClaim),
                    value: claimTypes.MaxPowerGenerationClaim,
                    filter: () => this.isPhysicalAssetAuthority,
                },
            ],
        }
    },

    methods: {
        claimNeedsRealWorldPlantId(claimType) {
            return (
                claimType === claimTypes.RealWorldPlantIdClaim ||
                claimType === claimTypes.BalanceClaim ||
                claimType === claimTypes.ExistenceClaim ||
                claimType === claimTypes.GenerationTypeClaim ||
                claimType === claimTypes.LocationClaim ||
                claimType === claimTypes.MeteringClaim ||
                claimType === claimTypes.MaxPowerGenerationClaim
            )
        },
        claimTypeToName(claimType) {
            return claimTypeToName(claimType)
        },
        hexlifyData(data) {
            return this.drizzleInstance.web3.utils.toHex(data)
        },
        hexToAscii(hex) {
            return this.drizzleInstance.web3.utils.hexToAscii(hex)
        },
        getHash(address, topic, data) {
            return this.drizzleInstance.web3.utils.soliditySha3(address, topic, data)
        },
        addClaim() {
            let data = {
                expiryDate: new String(+new Date(this.formData.expiryDate)),
                startDate: '1',
            }

            if (this.claimNeedsRealWorldPlantId(this.selectedClaimType)) {
                data.realWorldPlantId = this.formData.realWorldPlantId
            }

            if (this.selectedClaimType === claimTypes.ExistenceClaim) {
                data.type = this.formData.type
            }

            if (this.selectedClaimType === claimTypes.MaxPowerGenerationClaim) {
                data.maxGen = this.formData.maxGen
            }

            if (this.selectedClaimType === claimTypes.MaxPowerConsumptionClaim) {
                data.maxCon = this.formData.maxCon
            }

            let targetAddress = this.identityContract.idcAddress
            // target Identity Contract as web3 Contract Object
            let targetIdentityContract = getNewContract(IdentityContract, targetAddress)

            if (this.selectedClaimType === claimTypes.AcceptedDistributorClaim) {
                data.address = this.identityContract.idcAddress.toString().slice(2).toLowerCase()

                targetAddress = this.drizzleInstance.contracts.Distributor.address
                targetIdentityContract = getNewContract(Distributor, targetAddress)
            }

            // takes the users first activeAccount Identity Contract as issuer
            // won't work if the user has multiple identity contracts
            const issuerAddress = this.activeAccountIdentityContracts[0].idcAddress

            console.log(data)
            const hexlifiedData = this.hexlifyData(data)

            const hashToSign = this.getHash(targetAddress, this.selectedClaimType, hexlifiedData)
            console.log(hashToSign)

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                targetIdentityContract.methods
                    .addClaim(this.selectedClaimType, 1, issuerAddress, signature, hexlifiedData, '')
                    .send({ from: this.activeAccount })
            })
        },
    },

    computed: {
        ...mapState('identityContracts', ['identityContracts']),
        ...mapGetters('identityContracts', ['activeAccountIdentityContracts']),
        ...mapState('currentUser', [
            'isBalanceAuthority',
            'isMarketAuthority',
            'isMeteringAuthority',
            'isPhysicalAssetAuthority',
        ]),
        ...mapGetters('drizzle', ['drizzleInstance']),
        ...mapGetters('accounts', ['activeAccount']),

        // formated date to show in the date picker
        formattedDate() {
            return new Date(this.formData.expiryDate).toLocaleDateString()
        },

        // filtered claim types by active account
        filteredClaimTypes() {
            return this.claimTypes.filter((claimType) => {
                return claimType.filter()
            })
        },
    },
}
</script>

<style></style>
