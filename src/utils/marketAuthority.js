import store from '@/store'

import { getNewContract } from './drizzle'
import IdentityContract from '../contracts/IdentityContract.json'

export const addClaim = async (address, topic, data) => {
    const web3 = store.getters['drizzle/drizzleInstance'].web3

    data = web3.utils.toHex(data.toString())

    const hash = web3.utils.soliditySha3(address, topic, data)

    const authority = getNewContract(IdentityContract, address)

    const activeAccount = store.getters['accounts/activeAccount']

    await store.getters['drizzle/drizzleInstance'].web3.eth
        .sign(hash, activeAccount)
        .then((signature) => {
            authority.methods
                .addClaim(
                    topic,
                    1,
                    '0x756c3e6865f3b42dbcae890aea73d7fbfdc5f240',
                    signature,
                    data,
                    ''
                )
                .send({ from: activeAccount, gas: 6000000 })
                .then(console.log)
        })
}
