import store from '../index'

import { getNewContract } from '../../utils/drizzle'
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

                return [marketAuthority, ...identityContracts]
            }
        },
        addIdentityContract(ctx, identityContract) {
            ctx.commit('ADD_IDENTITY_CONTRACT', identityContract)
        },
    },
    namespaced: true,
}
