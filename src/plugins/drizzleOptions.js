import IdentityContractFactory from '@/contracts/IdentityContractFactory.json'
import IdentityContract from '@/contracts/IdentityContract.json'
import EnergyToken from '@/contracts/EnergyToken.json'
import Distributor from '@/contracts/Distributor.json'

import Web3 from 'web3'

import { Drizzle } from '@drizzle/store'

const options = {
    web3: {
        block: false,
        customProvider: new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545'),
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:8545',
        },
    },
    contracts: [IdentityContract, IdentityContractFactory, EnergyToken, Distributor],
    events: {
        IdentityContractFactory: ['IdentityContractCreation'],
    },
    polls: {
        accounts: 15000,
    },
}

// exports drizzle options as default
export default options

// exports drizzle object for direct use without the vuex store
export const drizzle = new Drizzle(options)
