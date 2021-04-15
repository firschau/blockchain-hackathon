import store from '../store'

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

export function claimTypeToName(claimType) {
    switch (claimType) {
        case 10010:
            return 'Is Balance Authority Claim'
        case 10020:
            return 'Is Metering Authority Claim'
        case 10030:
            return 'Is Physical Asset Authority Claim'
        case 10040:
            return 'Metering Claim'
        case 10050:
            return 'Balance Claim'
        case 10060:
            return 'Existance Claim'
        case 10065:
            return 'Max Power Generation Claim'
        case 10070:
            return 'Generation Type Claim'
        case 10080:
            return 'Location Claim'
        case 10090:
            return 'Identity Contract Factory Claim'
        case 10100:
            return 'Energy Token Contract Claim'
        case 10110:
            return 'Market Rules Claim'
        case 10120:
            return 'Accepted Distributor Claim'
        case 10130:
            return 'Real World Plant ID Claim'
        case 10140:
            return 'Max Power Consumption Claim'
        default:
            return 'Unknown'
    }
}

export function serializeClaim(claim) {
    return {
        ...claim,
        __topic: +claim.__topic,
        __data: JSON.parse(store.getters['drizzle/drizzleInstance'].web3.utils.hexToAscii(claim.__data)),
    }
}
