module.exports = async function (callback) {
    const accounts = await web3.eth.getAccounts()

    console.log(accounts)

    callback()
    // perform actions
}
