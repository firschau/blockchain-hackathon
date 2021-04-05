const eutil = require('ethereumjs-util')
var IdentityContract = artifacts.require('IdentityContract.sol')
var IdentityContractFactory = artifacts.require('IdentityContractFactory.sol')
var EnergyToken = artifacts.require('EnergyToken.sol')
var Distributor = artifacts.require('Distributor.sol')

module.exports = async function (callback) {
    try {
        const accounts = await web3.eth.getAccounts()

        const abi = IdentityContract.abi

        const identityContract = await IdentityContract.deployed()
        const identityContractFactory = await IdentityContractFactory.deployed()
        const energyToken = await EnergyToken.deployed()
        const distributor = await Distributor.deployed()

        // get all events of created identity contracts
        const events = await identityContractFactory.getPastEvents('IdentityContractCreation', {
            fromBlock: 'earliest',
            toBlock: 'latest',
        })

        const [balanceAuthority, meteringAuthority, physicalAssetAuthority, ...idcs] = events.map(
            (event) => new web3.eth.Contract(abi, event.returnValues.idcAddress)
        )
        let claimBalance = await balanceAuthority.methods.getClaimIdsByTopic(10010).call()
        let claimMetering = await meteringAuthority.methods.getClaimIdsByTopic(10020).call()
        let claimPhysical = await physicalAssetAuthority.methods.getClaimIdsByTopic(10030).call()
        console.log('o o  o o o o o o o  o o o o o o o o o o o o o o o  o  o')
        console.log('MarketAuthority  address         ---> ' + identityContract.address)

        console.log('physicalAssetAuthority  address  ---> ' + physicalAssetAuthority._address)
        console.log('       claimPhysical is there         ' + (web3.utils.numberToHex(claimPhysical[0]) != undefined))
        console.log('meteringAuthority       address  ---> ' + meteringAuthority._address)
        console.log('       claimMetering is there         ' + (web3.utils.numberToHex(claimMetering[0]) != undefined))
        console.log('balanceAuthority        address  ---> ' + balanceAuthority._address)
        console.log('       claimBalance  is there         ' + (web3.utils.numberToHex(claimBalance[0]) != undefined))
        console.log('')
        //un console.log(idcs.length == 0)
        for (let i = 0; i < idcs.length; i++) {
            console.log(`idc-${i}   address               ---> ${idcs[i]._address}`)
            console.log(`    ${i}-owner:    ${await idcs[i].methods.owner().call()}`)
            //un console.log(idcs[0] == undefined)
        }

        // on top- energyToken = await EnergyToken.deployed()
        energyTokenWeb3 = new web3.eth.Contract(EnergyToken.abi, energyToken.address)
        console.log('EnergyToken Contract address     ---> ' + energyToken.address)
        console.log('   MarketAuth. addr. of Contract: ' + (await energyToken.marketAuthority()))

        // on top- distributor = await Distributor.deployed()
        distributorWeb3 = new web3.eth.Contract(Distributor.abi, distributor.address)
        console.log('Distributor Contract address     ---> ' + distributor.address)
        console.log('   EnergyToken. addr. of Contract: ' + (await distributor.energyToken()))

        //console.log(`Address physicalAssetAuthority IDC        - - -> ${physicalAssetAuthority.options.address}`)
    } catch (e) {
        console.log(e)
    }
    callback()
}
