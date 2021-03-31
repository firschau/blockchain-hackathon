import store from '@/store'

import { getNewContract } from './drizzle'
import IdentityContract from '../contracts/IdentityContract.json'

export const addClaim = (address, topic, data) => {
    const authority = getNewContract(IdentityContract, address)

    const activeAccount = store.getters['accounts/activeAccount']

    const web3 = store.getters['drizzle/drizzleInstance'].web3
    console.log(store.getters['drizzle/drizzleInstance'].web3.eth)

    store.getters['drizzle/drizzleInstance'].web3.eth.personal
        .sign(
            web3.utils.utf8ToHex([address, topic, data].toString()),
            activeAccount
        )
        .then((signature) => {
            console.log(signature)
            authority.methods
                .addClaim(topic, 1, activeAccount, signature, data, address)
                .call()
                .then((response) => console.log(response))
        })

    /**
 

 console.log(authority)
 */
}
