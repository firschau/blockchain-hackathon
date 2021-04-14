var IdentityContract = artifacts.require('IdentityContract.sol')
var IdentityContractFactory = artifacts.require('IdentityContractFactory.sol')
var EnergyToken = artifacts.require('EnergyToken.sol')
var Distributor = artifacts.require('Distributor.sol')

module.exports = async function () {
    const identityContract = await IdentityContract.deployed()
    const identityContractFactory = await IdentityContractFactory.deployed()
    const energyToken = await EnergyToken.deployed()
    const distributor = await Distributor.deployed()

    return [
        IdentityContract,
        identityContract,
        IdentityContractFactory,
        identityContractFactory,
        EnergyToken,
        energyToken,
        Distributor,
        distributor,
    ]
}
