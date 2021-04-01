import IdentityContractFactory from '@/contracts/IdentityContractFactory.json'
import IdentityContract from '@/contracts/IdentityContract.json'
import ClaimVerifier from '../contracts/ClaimVerifier.json'

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
    contracts: [IdentityContract, IdentityContractFactory, ClaimVerifier],
    events: {
        SimpleStorage: ['StorageSet'],
        IdentityContractFactory: ['IdentityContractCreation'],
    },
    polls: {
        accounts: 15000,
    },
}

export default options

export const drizzle = new Drizzle(options)
