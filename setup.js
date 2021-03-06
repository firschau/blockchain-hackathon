const eutil = require('ethereumjs-util')

const account5Sk = '0x533a905ac396ca2857e36fcb29a6361e86a3d131fd126b179a230a457c1abdd1'
const account6Sk = '0x294dcf7158a75155458ab3cc50d044d498f07d0a0e5ae6d140addb5e5f4e9360'
const account7Sk = '0x547fa26372d75d470a292c0a3e77f576bfb17a7bebd0fb686bea5700c476c5f8'
const account8Sk = '0x56f01dc407e7462c8a47d048c35cd61794f2893696ec4aaafcc46cd33a22cd58'
const account9Sk = '0x5b1b39d1cf63bdef178e6ad182b1ae852ac6b26a802121ab2c4df936665731d8'

var IdentityContract = require('./src/contracts/IdentityContract.json')
var IdentityContractFactory = require('./src/contracts/IdentityContractFactory.json')

module.exports = async function (callback) {
    const accounts = await web3.eth.getAccounts()

    let marketAuthority = new web3.eth.Contract(IdentityContract.abi, IdentityContract.networks[5777].address)
    console.log(
        `Successfully deployed IdentityContract for Market Authority with address: ${marketAuthority.options.address}`
    )

    let identityContractFactory = new web3.eth.Contract(
        IdentityContractFactory.abi,
        IdentityContractFactory.networks[5777].address
    )
    console.log(
        `Successfully deployed IdentityContractFactory with address: ${identityContractFactory.options.address}`
    )

    let abi = marketAuthority.abi

    console.log(identityContractFactory.methods.createIdentityContract)
    console.log(identityContractFactory.options.address)

    console.log(identityContractFactory.once)

    const balanceAuthorityCreatedEvent = identityContractFactory.events.IdentityContractCreation((event) => console.log)
    let balanceAuthorityDeployment = await identityContractFactory.methods
        .createIdentityContract()
        .send({ from: accounts[8], gas: 7000000 })
    console.log(balanceAuthorityCreatedEvent)
    // let balanceAuthorityAddress = balanceAuthorityDeployment.logs[0].args.idcAddress
    // balanceAuthority = new web3.eth.Contract(abi, balanceAuthorityAddress)
    // console.log(`Successfully deployed Balance Authority IDC with address: ${balanceAuthority.options.address}`)

    // let meteringAuthorityDeployment = await identityContractFactory.methods.createIdentityContract({
    //     from: accounts[8],
    // }).send({})
    // let meteringAuthorityAddress = meteringAuthorityDeployment.logs[0].args.idcAddress
    // meteringAuthority = new web3.eth.Contract(abi, meteringAuthorityAddress)
    // console.log(`Successfully deployed Metering Authority IDC with address: ${meteringAuthority.options.address}`)

    // let physicalAssetAuthorityDeployment = await identityContractFactory.methods.createIdentityContract({
    //     from: accounts[8],
    // }).send({})
    // let physicalAssetAuthorityAddress = physicalAssetAuthorityDeployment.logs[0].args.idcAddress
    // physicalAssetAuthority = new web3.eth.Contract(abi, physicalAssetAuthorityAddress)
    // console.log(
    //     `Successfully deployed Physical Asset Authority IDC with address: ${physicalAssetAuthority.options.address}`
    // )

    // let json = '{ "q": "ab", "expiryDate": "1895220001", "startDate": "1" }'
    // let data = web3.utils.toHex(json)
    // await addClaim(balanceAuthority, 10010, marketAuthority.options.address, data, '', account9Sk)
    // await addClaim(meteringAuthority, 10020, marketAuthority.options.address, data, '', account9Sk)
    // await addClaim(physicalAssetAuthority, 10030, marketAuthority.options.address, data, '', account9Sk)

    // async function addClaim(subject, topic, issuerAddress, data, uri, signingKey) {
    //     // Handle difference between Truffle contract object and web3 contract object.
    //     let isWeb3Contract = false
    //     let subjectAddress = subject.address
    //     if (subjectAddress === undefined) {
    //         isWeb3Contract = true
    //         subjectAddress = subject.options.address
    //     }

    //     let hash = web3.utils.soliditySha3(subjectAddress, topic, data)
    //     let signatureSplit = await eutil.ecsign(
    //         new Buffer(hash.slice(2), 'hex'),
    //         new Buffer(signingKey.slice(2), 'hex')
    //     )
    //     let signatureMerged =
    //         '0x' + signatureSplit.r.toString('hex') + signatureSplit.s.toString('hex') + signatureSplit.v.toString(16)

    //     if (!isWeb3Contract) {
    //         await subject.addClaim(topic, 1, issuerAddress, signatureMerged, data, uri)
    //     } else {
    //         await subject.methods
    //             .addClaim(topic, 1, issuerAddress, signatureMerged, data, uri)
    //             .send({ from: accounts[0], gas: 7000000 })
    //     }
    // }
    setTimeout(callback, 5000)
    // perform actions
}
