const eutil = require('ethereumjs-util')

const account0Sk = '0xd509b5e75b6bf703e51a1200b2f4cf6570dedfc39cc1fc706abba496ba322830'
const account1Sk = '0xf73b4a8853407b5fe31bc5b1078a1ce1e365bcd5a086911e5b99ab88c17890b8'
const account2Sk = '0x0a00218ea7be46d316b29fb9d979fe2b7aa2a7985ec03065c52d58dc87bb01f4'
const account3Sk = '0xaea80eec3d12a7710096328e1f28bef9cbc674320768174711d5614ba07bfe46' // ids[0]
const account4Sk = '0x6c4c26b18d80a1a91f717193f2381227049f29a96b7e9cd118969261beac6a0d' // ids[1]
const account5Sk = '0x533a905ac396ca2857e36fcb29a6361e86a3d131fd126b179a230a457c1abdd1' // ids[2]
const account6Sk = '0x294dcf7158a75155458ab3cc50d044d498f07d0a0e5ae6d140addb5e5f4e9360' // Physical Asset Authority
const account7Sk = '0x547fa26372d75d470a292c0a3e77f576bfb17a7bebd0fb686bea5700c476c5f8' // Metering Authority
const account8Sk = '0x56f01dc407e7462c8a47d048c35cd61794f2893696ec4aaafcc46cd33a22cd58' // Balance Authority
const account9Sk = '0x5b1b39d1cf63bdef178e6ad182b1ae852ac6b26a802121ab2c4df936665731d8' // Market Authority

var IdentityContract = artifacts.require('IdentityContract.sol')
var IdentityContractFactory = artifacts.require('IdentityContractFactory.sol')
var EnergyToken = artifacts.require('EnergyToken.sol')
var Distributor = artifacts.require('Distributor.sol')

module.exports = async function (callback) {
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

    /**
     * first event -> balance authority
     * second -> metering authority
     * third -> physical asset authority
     * rest -> idcs array
     */
    const [balanceAuthority, meteringAuthority, physicalAssetAuthority, ...idcs] = events.map(
        (event) => new web3.eth.Contract(abi, event.returnValues.idcAddress)
    )

    async function addClaim(subject, topic, issuerAddress, data, uri, signingKey) {
        // Handle difference between Truffle contract object and web3 contract object.
        let isWeb3Contract = false
        let subjectAddress = subject.address
        if (subjectAddress === undefined) {
            isWeb3Contract = true
            subjectAddress = subject.options.address
        }

        let hash = web3.utils.soliditySha3(subjectAddress, topic, data)
        let signatureSplit = await eutil.ecsign(
            new Buffer(hash.slice(2), 'hex'),
            new Buffer(signingKey.slice(2), 'hex')
        )
        let signatureMerged =
            '0x' + signatureSplit.r.toString('hex') + signatureSplit.s.toString('hex') + signatureSplit.v.toString(16)

        if (!isWeb3Contract) {
            await subject.addClaim(topic, 1, issuerAddress, signatureMerged, data, uri)
        } else {
            await subject.methods
                .addClaim(topic, 1, issuerAddress, signatureMerged, data, uri)
                .send({ from: accounts[0], gas: 7000000 })
        }
    }

    // IDC 0 is the generation plant.
    // IDC 2 is the token recipient.

    // Claim necessary for receiving.
    let jsonAcceptedDistributor =
        '{ "t": "t", "expiryDate": "1895220001", "startDate": "1", "address": "' +
        idcs[2].options.address.slice(2).toLowerCase() +
        '" }'
    let dataAcceptedDistributor = web3.utils.toHex(jsonAcceptedDistributor)
    await addClaim(distributor, 10120, balanceAuthority.options.address, dataAcceptedDistributor, '', account8Sk)

    // Give claims to IDC 0.
    const json = '{ "q": "ab", "expiryDate": "1895220001", "startDate": "1", "realWorldPlantId": "bestPlantId" }'
    const data = web3.utils.toHex(json)
    const jsonExistenceGeneration =
        '{ "type": "generation", "expiryDate": "1895220001", "startDate": "1", "realWorldPlantId": "bestPlantId" }'
    const dataExistenceGeneration = web3.utils.toHex(jsonExistenceGeneration)
    const jsonMaxGen =
        '{ "maxGen": "300000000", "expiryDate": "1895220001", "startDate": "1", "realWorldPlantId": "bestPlantId" }'
    const dataMaxGen = web3.utils.toHex(jsonMaxGen)
    const jsonMaxCon =
        '{ "maxCon": "150000000", "expiryDate": "1895220001", "startDate": "1", "realWorldPlantId": "bestPlantId" }'
    const dataMaxCon = web3.utils.toHex(jsonMaxCon)

    await addClaim(idcs[0], 10130, idcs[0].options.address, data, '', account3Sk)
    await addClaim(idcs[0], 10050, balanceAuthority.options.address, data, '', account8Sk)
    await addClaim(idcs[0], 10060, physicalAssetAuthority.options.address, dataExistenceGeneration, '', account6Sk)
    await addClaim(idcs[0], 10070, physicalAssetAuthority.options.address, data, '', account6Sk)
    await addClaim(idcs[0], 10080, physicalAssetAuthority.options.address, data, '', account6Sk)
    await addClaim(idcs[0], 10040, meteringAuthority.options.address, data, '', account7Sk)
    await addClaim(idcs[0], 10065, physicalAssetAuthority.options.address, dataMaxGen, '', account6Sk)

    // Give claims to IDC 2.
    await addClaim(idcs[2], 10130, idcs[2].options.address, data, '', account5Sk)
    await addClaim(idcs[2], 10040, meteringAuthority.options.address, data, '', account7Sk)
    await addClaim(idcs[2], 10050, balanceAuthority.options.address, data, '', account8Sk)
    await addClaim(idcs[2], 10060, physicalAssetAuthority.options.address, dataExistenceGeneration, '', account6Sk)
    await addClaim(idcs[2], 10065, physicalAssetAuthority.options.address, dataMaxGen, '', account6Sk)
    await addClaim(idcs[2], 10140, physicalAssetAuthority.options.address, dataMaxCon, '', account6Sk)

    callback()
}
