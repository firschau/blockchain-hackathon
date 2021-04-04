const eutil = require('ethereumjs-util')

const account5Sk = '0x533a905ac396ca2857e36fcb29a6361e86a3d131fd126b179a230a457c1abdd1'
const account6Sk = '0x294dcf7158a75155458ab3cc50d044d498f07d0a0e5ae6d140addb5e5f4e9360'
const account7Sk = '0x547fa26372d75d470a292c0a3e77f576bfb17a7bebd0fb686bea5700c476c5f8'
const account8Sk = '0x56f01dc407e7462c8a47d048c35cd61794f2893696ec4aaafcc46cd33a22cd58'
const account9Sk = '0x5b1b39d1cf63bdef178e6ad182b1ae852ac6b26a802121ab2c4df936665731d8'

//const Distributor = require('./src/contracts/Distributor.json')

// var Distributor = artifacts.require('Distributor.sol')

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
    console.log(balanceAuthority.options.address)

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
    if (idcs.length == 0) {
        for (let i = 0; i < 3; i++) {
            let idcDeployment = await identityContractFactory.createIdentityContract({ from: accounts[i + 5] })
            assert.equal(balanceAuthorityDeployment.logs[0].event, 'IdentityContractCreation')
            let idcAddress = idcDeployment.logs[0].args.idcAddress
            idcs[i] = new web3.eth.Contract(abi, idcAddress)
        }
    }

    try {
        const claimIds = await distributor.getClaimIdsByTopic(10120)

        console.log(claimIds[0])
        const claim = await distributor.getClaim(claimIds[0])
        console.log(claim)
    } catch (e) {
        console.log(e)
    }

    try {
        let jsonAcceptedDistributor =
            '{ "t": "t", "expiryDate": "1895220001", "startDate": "1", "address": "' +
            idcs[2].options.address.slice(2).toLowerCase() +
            '" }'
        let dataAcceptedDistributor = web3.utils.toHex(jsonAcceptedDistributor)
        await addClaim(distributor, 10120, balanceAuthority.options.address, dataAcceptedDistributor, '', account8Sk)
    } catch (e) {
        console.log(e)
    }

    callback()
}
