import store from '../index'

import IdentityContract from '../../contracts/IdentityContract.json'

import { claimTypes } from '../../utils/claims'
import { getNewContract } from '../../utils/drizzle'

export const currentUserModule = {
    state: () => ({
        isBalanceAuthority: false,
        isMarketAuthority: false,
        isMeteringAuthority: false,
        isPhysicalAssetAuthority: false,
    }),
    mutations: {
        RESET(state) {
            state.isBalanceAuthority = false
            state.isMarketAuthority = false
            state.isMeteringAuthority = false
            state.isPhysicalAssetAuthority = false
        },
        SET_ISBALANCEAUTHORITY(state, newVal) {
            state.isBalanceAuthority = newVal
        },
        SET_ISMARKETAUTHORITY(state, newVal) {
            state.isMarketAuthority = newVal
        },
        SET_ISMETERINGAUTHORITY(state, newVal) {
            state.isMeteringAuthority = newVal
        },
        SET_ISPHYSICALASSETAUTHORITY(state, newVal) {
            state.isPhysicalAssetAuthority = newVal
        },
    },
    actions: {
        reset(ctx) {
            ctx.commit('RESET')
        },
        setIsBalanceAuthority(ctx, newVal) {
            ctx.commit('SET_ISBALANCEAUTHORITY', newVal)
        },
        setIsMarketAuthority(ctx, newVal) {
            ctx.commit('SET_ISMARKETAUTHORITY', newVal)
        },
        setIsMeteringAuthority(ctx, newVal) {
            ctx.commit('SET_ISMETERINGAUTHORITY', newVal)
        },
        setIsPhysicalAssetAuthority(ctx, newVal) {
            ctx.commit('SET_ISPHYSICALASSETAUTHORITY', newVal)
        },

        /**
         * initializes the state
         * checks if the active user is owner of the market authority identity contract
         * checksi if any of the active users identity contracts has a balance, metering, or physical asset claim
         */
        initActiveAccount(ctx) {
            // reset the state
            ctx.commit('RESET')

            // load all identity contracts first
            store.dispatch('identityContracts/getAndSetIdentityContracts').then(() => {
                // identity contracts of the active account
                const activeAccountIdentityContracts = store.getters['identityContracts/activeAccountIdentityContracts']

                // create new web3 contract objects
                const identityContracts = activeAccountIdentityContracts.map((idc) =>
                    getNewContract(IdentityContract, idc.idcAddress)
                )

                const marketAuthority = identityContracts.find(
                    (contract) =>
                        contract.options.address ===
                        store.getters['drizzle/drizzleInstance'].contracts.IdentityContract.address
                )

                if (marketAuthority) {
                    ctx.commit('SET_ISMARKETAUTHORITY', true)
                }

                identityContracts.forEach((idc) => {
                    // check if any of the identity contracts has a balance authority claim
                    idc.methods
                        .getClaimIdsByTopic(claimTypes.IsBalanceAuthority)
                        .call()
                        .then((ids) => {
                            if (ids.length) {
                                ctx.commit('SET_ISBALANCEAUTHORITY', true)
                            }
                        })

                    // check if any of the identity contracts has a metering authority claim
                    idc.methods
                        .getClaimIdsByTopic(claimTypes.IsMeteringAuthority)
                        .call()
                        .then((ids) => {
                            if (ids.length) {
                                ctx.commit('SET_ISMETERINGAUTHORITY', true)
                            }
                        })

                    // check if any of the identity contracts has a physical asset authority claim
                    idc.methods
                        .getClaimIdsByTopic(claimTypes.IsPhysicalAssetAuthority)
                        .call()
                        .then((ids) => {
                            if (ids.length) {
                                ctx.commit('SET_ISPHYSICALASSETAUTHORITY', true)
                            }
                        })
                })
            })
        },
    },
    namespaced: true,
}
