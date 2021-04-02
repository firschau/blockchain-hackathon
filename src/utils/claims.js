import store from '@/store'

import { getNewContract } from './drizzle'
import IdentityContract from '../contracts/IdentityContract.json'

export const claimTypes = {
    IsBalanceAuthority: 10010,
    IsMeteringAuthority: 10020,
    IsPhysicalAssetAuthority: 10030,
    MeteringClaim: 10040,
    BalanceClaim: 10050,
    ExistenceClaim: 10060,
    MaxPowerGenerationClaim: 10065,
    GenerationTypeClaim: 10070,
    LocationClaim: 10080,
    IdentityContractFactoryClaim: 10090,
    EnergyTokenContractClaim: 10100,
    MarketRulesClaim: 10110,
    AcceptedDistributorClaim: 10120,
    RealWorldPlantIdClaim: 10130,
    MaxPowerConsumptionClaim: 10140,
}

export const addClaim = async (address, topic, data, issuerAddress) => {
    const web3 = store.getters['drizzle/drizzleInstance'].web3

    data = web3.utils.toHex(JSON.stringify(data))

    const hash = web3.utils.soliditySha3(address, topic, data)

    const authority = getNewContract(IdentityContract, address)

    const activeAccount = store.getters['accounts/activeAccount']

    return await store.getters['drizzle/drizzleInstance'].web3.eth.sign(hash, activeAccount).then((signature) => {
        return authority.methods.addClaim(topic, 1, issuerAddress, signature, data, '').send({ from: activeAccount })
    })
}
