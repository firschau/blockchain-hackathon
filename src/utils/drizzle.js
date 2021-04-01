import store from '@/store'

export const cacheCall = (contract, method, ...args) => {
    return store.getters['drizzle/drizzleInstance'].contracts[contract].methods[
        method
    ].cacheCall(...args)
}

export const call = (contract, method, ...args) => {
    return store.getters['drizzle/drizzleInstance'].contracts[contract].methods[
        method
    ](...args).call()
}

export const cacheSend = (contract, method, value, ...args) => {
    return store.getters['drizzle/drizzleInstance'].contracts[contract].methods[
        method
    ].cacheSend(value, ...args)
}

export const send = (contract, method, value, ...args) => {
    return store.getters['drizzle/drizzleInstance'].contracts[contract].methods[
        method
    ](value).send(...args)
}

export const getNewContract = (jsonInterface, address) =>
    new store.getters['drizzle/drizzleInstance'].web3.eth.Contract(
        jsonInterface.abi,
        address
    )
