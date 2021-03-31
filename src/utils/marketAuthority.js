import store from '@/store'

import { getNewContract } from './drizzle'
import IdentityContract from '../contracts/IdentityContract.json'

export const addClaim = (address, topic, data) => {
    const authority = getNewContract(IdentityContract, address)

    const activeAccount = store.getters['accounts/activeAccount']

    const web3 = store.getters['drizzle/drizzleInstance'].web3
    console.log(store.getters['drizzle/drizzleInstance'].web3.eth)

    console.log(address + topic + data)

    store.getters['drizzle/drizzleInstance'].web3.eth.personal
        .sign(web3.utils.soliditySha3(address, topic, data), activeAccount)
        .then((signature) => {
            console.log(topic)
            console.log(1)
            console.log(activeAccount)
            console.log(signature)
            console.log(data)
            console.log('example.com')
            authority.methods
                .addClaim(topic, 1, activeAccount, signature, data, '')
                .send({ from: activeAccount, gas: 7000000 })
                .then((response) => console.log(response))
        })
}
