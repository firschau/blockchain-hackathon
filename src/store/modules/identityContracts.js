import store from '../index'

import { getNewContract } from '../../utils/drizzle'
import { claimTypes, serializeClaim } from '@/utils/claims'
import IdentityContractFactory from '../../contracts/IdentityContractFactory.json'
import IdentityContract from '../../contracts/IdentityContract.json'

export const identityContractsModule = {
    state: () => ({
        // holds all identity contracts of the market, market identity contract at index 0
        identityContracts: [],
    }),
    getters: {
        // returns the identity contracts of the active account
        activeAccountIdentityContracts(state) {
            const activeAccount = store.getters['accounts/activeAccount']
            return state.identityContracts.filter((idc) => idc.owner === activeAccount)
        },

        // returns boolean wether the active account ist a balance authority
        activeAccountIsBalanceAuthority(state, getters) {
            return getters['activeAccountIdentityContracts'].some((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsBalanceAuthority)
            )
        },

        // returns boolean wether the active account ist a metering authority
        activeAccountIsMeteringAuthority(state, getters) {
            return getters['activeAccountIdentityContracts'].some((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsMeteringAuthority)
            )
        },

        // returns boolean wether the active account ist a physical asset authority
        activeAccountIsPhysicalAssetAuthority(state, getters) {
            return getters['activeAccountIdentityContracts'].some((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsPhysicalAssetAuthority)
            )
        },

        // returns boolean wether the active account ist the market authority
        activeAccountIsMarketAuthority(state) {
            if (state.identityContracts.length) {
                // identityContracts[0] will always be the market authority identity contract
                return state.identityContracts[0].owner === store.getters['accounts/activeAccount']
            } else {
                return false
            }
        },
    },
    mutations: {
        SET_IDENTITY_CONTRACTS(state, newIdentityContracts) {
            state.identityContracts = newIdentityContracts
        },
        ADD_IDENTITY_CONTRACT(state, newIdentityContract) {
            state.identityContracts.push(newIdentityContract)
        },
        ADD_IDENTITY_CONTRACTS(state, newIdentityContracts) {
            state.identityContracts.push(...newIdentityContracts)
        },

        // adds a claim to the given identity contract
        ADD_CLAIM(state, { identityContractAddress, claim }) {
            state.identityContracts.find((idc) => idc.idcAddress === identityContractAddress)?.claims.push(claim)
        },
    },
    actions: {
        /**
         * loads the identity contracts from the blockchain and sets the state
         * @returns array of identity contracts
         */
        async getAndSetIdentityContracts(ctx) {
            // if identity contracts are already loaded no need to load them again
            if (ctx.state.identityContracts.length) {
                return Promise.resolve(ctx.state.identityContracts)
            } else {
                const drizzleInstance = store.getters['drizzle/drizzleInstance']

                const marketAuthorityOwner = await drizzleInstance.contracts.IdentityContract.methods.owner().call()

                const marketAuthority = {
                    owner: marketAuthorityOwner,
                    idcAddress: drizzleInstance.contracts.IdentityContract.address,
                    web3Contract: getNewContract(IdentityContract, drizzleInstance.contracts.IdentityContract.address),
                    claims: [],
                }

                // web3 Contract
                const identityContractFactory = getNewContract(
                    IdentityContractFactory,
                    drizzleInstance.contracts.IdentityContractFactory.address
                )

                // gets all past IdenityContractCreation events
                const identityContracts = await identityContractFactory
                    .getPastEvents('IdentityContractCreation', {
                        fromBlock: 'earliest',
                        toBlock: 'latest',
                    })
                    .then((events) => {
                        // map the contracts to a specific format
                        const identityContracts = events.map((event) => ({
                            idcAddress: event.returnValues.idcAddress,
                            owner: event.returnValues.owner,
                            web3Contract: getNewContract(IdentityContract, event.returnValues.idcAddress),
                            claims: [],
                        }))

                        return identityContracts
                    })

                // commit the loaded identity contracts to the state
                ctx.commit('ADD_IDENTITY_CONTRACTS', [marketAuthority, ...identityContracts])

                // dispatch the getAndSetMarketClaims method
                ctx.dispatch('getAndSetMarketClaims')

                return [marketAuthority, ...identityContracts]
            }
        },

        // add a single identity contract to the state
        addIdentityContract(ctx, identityContract) {
            ctx.commit('ADD_IDENTITY_CONTRACT', {
                idcAddress: identityContract.idcAddress,
                owner: identityContract.owner,
                web3Contract: getNewContract(IdentityContract, identityContract.idcAddress),
                claims: [],
            })
        },

        // loads claims of the authorities and adds them to the respective identity contracts
        async getAndSetMarketClaims(ctx) {
            ctx.state.identityContracts.forEach((identityContract) => {
                // claim types
                const marketClaims = [
                    claimTypes.IsBalanceAuthority,
                    claimTypes.IsMeteringAuthority,
                    claimTypes.IsPhysicalAssetAuthority,
                ]

                marketClaims.forEach(async (claimType) => {
                    const claimIds = await identityContract.web3Contract.methods.getClaimIdsByTopic(claimType).call()

                    if (claimIds.length) {
                        const claim = await identityContract.web3Contract.methods.getClaim(claimIds[0]).call()

                        // commit add claim mutation
                        ctx.commit('ADD_CLAIM', {
                            identityContractAddress: identityContract.idcAddress,
                            claim: { id: claimIds[0], ...serializeClaim(claim) },
                        })
                    }
                })
            })
        },
    },
    namespaced: true,
}
