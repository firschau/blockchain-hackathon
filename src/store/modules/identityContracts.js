import store from '../index'

import { getNewContract } from '../../utils/drizzle'
import IdentityContractFactory from '../../contracts/IdentityContractFactory.json'

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
    },
    mutations: {
        SET_IDENTITY_CONTRACTS(state, newIdentityContracts) {
            state.identityContracts = newIdentityContracts
        },
        ADD_IDENTITY_CONTRACT(state, newIdentityContract) {
            state.identityContracts.push(newIdentityContract)
        },
    },
    actions: {
        getAndSetIdentityContracts(ctx) {
            if (ctx.state.identityContracts.length) {
                return Promise.resolve(ctx.state.identityContracts)
            } else {
                const drizzleInstance = store.getters['drizzle/drizzleInstance']

                const identityContractFactory = getNewContract(
                    IdentityContractFactory,
                    drizzleInstance.contracts.IdentityContractFactory.address
                )

                // get all past events for created Identity Contracts
                return identityContractFactory
                    .getPastEvents('IdentityContractCreation', {
                        fromBlock: 'earliest',
                        toBlock: 'latest',
                    })
                    .then((events) => {
                        const identityContracts = events.map((event) => ({
                            idcAddress: event.returnValues.idcAddress,
                            owner: event.returnValues.owner,
                        }))

                        // set the state
                        ctx.commit('SET_IDENTITY_CONTRACTS', identityContracts)

                        return identityContracts
                    })
            }
        },
        addIdentityContract(ctx, identityContract) {
            ctx.commit('ADD_IDENTITY_CONTRACT', identityContract)
        },
    },
    namespaced: true,
}
