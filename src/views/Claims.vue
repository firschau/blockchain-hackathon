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
import { claimTypes } from '../utils/claims'
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
                expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 365).toISOString().substring(0, 10),
                startDate: Date.now(),
                realWorldPlantId: 'BestPlantId',
                maxGen: 5000000,
                maxCon: 5000000,
                type: 'generator',
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
                {
                    name: 'Accepted Distributor Contracts Claim',
                    value: claimTypes.AcceptedDistributorClaim,
                    filter: () => this.isBalanceAuthority,
                },
            ],
        }
    },

    methods: {
        hexlifyData(data) {
            return this.drizzleInstance.web3.utils.toHex(data)
        },
        getHash(address, topic, data) {
            return this.drizzleInstance.web3.utils.soliditySha3(address, topic, data)
        },
        addClaim() {
            let data = {
                startDate: this.formData.startDate,
                expiryDate: +new Date(this.formData.expiryDate),
            }

            if (
                this.selectedClaimType === 10130 ||
                this.selectedClaimType === 10050 ||
                this.selectedClaimType === 10060 ||
                this.selectedClaimType === 10070 ||
                this.selectedClaimType === 10080 ||
                this.selectedClaimType === 10040 ||
                this.selectedClaimType === 10065
            ) {
                data.realWorldPlantId = this.formData.realWorldPlantId
            }

            if (this.selectedClaimType === 10060) {
                data.type = this.formData.type
            }

            if (this.selectedClaimType === 10065) {
                data.maxGen = this.formData.maxGen
            }

            if (this.selectedClaimType === 10140) {
                data.maxCon = this.formData.maxCon
            }

            let targetAddress = this.identityContract.idcAddress
            // target Identity Contract as web3 Contract Object
            let targetIdentityContract = getNewContract(IdentityContract, targetAddress)

            if (this.selectedClaimType === 10120) {
                data.address = this.identityContract.idcAddress.toString().slice(2).toLowerCase()
                data.t = 't'
                data.realWorldPlantId = 'dsfewfewf'
                console.log(JSON.stringify(data))
                targetAddress = this.drizzleInstance.contracts.Distributor.address
                console.log(targetAddress)

                targetIdentityContract = getNewContract(Distributor, targetAddress)
                console.log(targetIdentityContract)
            }

            // takes the users first activeAccount Identity Contract as issuer
            // won't work if the user has multiple identity contracts
            const issuerAddress = this.activeAccountIdentityContracts[0].idcAddress

            console.log(data)
            const hexlifiedData = this.hexlifyData(data)

            const hashToSign = this.getHash(targetAddress, this.selectedClaimType, hexlifiedData)
            console.log(hashToSign)

            this.drizzleInstance.web3.eth.sign(hashToSign, this.activeAccount).then((signature) => {
                console.log(this.selectedClaimType)
                console.log(1)
                console.log(issuerAddress)
                console.log(signature)
                console.log(hexlifiedData)
                console.log('')
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
