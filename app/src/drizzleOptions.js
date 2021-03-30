import IdentityContractFactory from './contracts/IdentityContractFactory.json'
import IdentityContract from './contracts/IdentityContract.json'

const options = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:8545',
        },
    },
    contracts: [IdentityContract, IdentityContractFactory],
    events: {
        SimpleStorage: ['StorageSet'],
        IdentityContractFactory: ['IdentityContractCreation'],
    },
    polls: {
        accounts: 15000,
    },
}

export default options
