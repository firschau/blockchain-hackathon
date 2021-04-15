import store from '../index'

import { getNewContract } from '../../utils/drizzle'
import { claimTypes, serializeClaim } from '@/utils/claims'
import IdentityContractFactory from '../../contracts/IdentityContractFactory.json'
import IdentityContract from '../../contracts/IdentityContract.json'

export const identityContractsModule = {
    state: () => ({
        identityContracts: [],
    }),
    getters: {
        // returns the identity contracts of the active account
        activeAccountIdentityContracts(state) {
            const activeAccount = store.getters['accounts/activeAccount']
            return state.identityContracts.filter((idc) => idc.owner === activeAccount)
        },
        activeAccountIsBalanceAuthority(state, getters) {
            return getters['activeAccountIdentityContracts'].some((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsBalanceAuthority)
            )
        },
        activeAccountIsMeteringAuthority(state, getters) {
            return getters['activeAccountIdentityContracts'].some((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsMeteringAuthority)
            )
        },
        activeAccountIsPhysicalAssetAuthority(state, getters) {
            return getters['activeAccountIdentityContracts'].some((idc) =>
                idc.claims.some((claim) => claim.__topic === claimTypes.IsPhysicalAssetAuthority)
            )
        },
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
        ADD_CLAIM(state, { identityContractAddress, claim }) {
            state.identityContracts.find((idc) => idc.idcAddress === identityContractAddress)?.claims.push(claim)
        },
    },
    actions: {
        async getAndSetIdentityContracts(ctx) {
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

                const identityContractFactory = getNewContract(
                    IdentityContractFactory,
                    drizzleInstance.contracts.IdentityContractFactory.address
                )

                const identityContracts = await identityContractFactory
                    .getPastEvents('IdentityContractCreation', {
                        fromBlock: 'earliest',
                        toBlock: 'latest',
                    })
                    .then((events) => {
                        const identityContracts = events.map((event) => ({
                            idcAddress: event.returnValues.idcAddress,
                            owner: event.returnValues.owner,
                            web3Contract: getNewContract(IdentityContract, event.returnValues.idcAddress),
                            claims: [],
                        }))

                        return identityContracts
                    })

                ctx.commit('ADD_IDENTITY_CONTRACTS', [marketAuthority, ...identityContracts])

                ctx.dispatch('getAndSetMarketClaims')

                return [marketAuthority, ...identityContracts]
            }
        },
        addIdentityContract(ctx, identityContract) {
            ctx.commit('ADD_IDENTITY_CONTRACT', {
                idcAddress: identityContract.idcAddress,
                owner: identityContract.owner,
                web3Contract: getNewContract(IdentityContract, identityContract.idcAddress),
                claims: [],
            })
        },
        async getAndSetMarketClaims(ctx) {
            ctx.state.identityContracts.forEach((identityContract) => {
                const marketClaims = [
                    claimTypes.IsBalanceAuthority,
                    claimTypes.IsMeteringAuthority,
                    claimTypes.IsPhysicalAssetAuthority,
                ]

                marketClaims.forEach(async (claimType) => {
                    const claimIds = await identityContract.web3Contract.methods.getClaimIdsByTopic(claimType).call()

                    claimIds.forEach(async (claimId) => {
                        const claim = await identityContract.web3Contract.methods.getClaim(claimId).call()

                        ctx.commit('ADD_CLAIM', {
                            identityContractAddress: identityContract.idcAddress,
                            claim: { id: claimId, ...serializeClaim(claim) },
                        })
                    })
                })
            })
        },
    },
    namespaced: true,
}
