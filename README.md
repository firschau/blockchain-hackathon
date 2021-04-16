# B2E2 - Smart Contracts

This Repository is the work of three KIT Students and was build in cooperation with [Energie Baden-Württemberg AG (EnBW)](https://www.enbw.com/).
This Application was developed during the first Blockchain Hackathon of the Institute for Critical Information Infrastructure in March and April 2021.
The Application allows the controlling and to managing of the market setup with its authorities and institutions.

The underlying Smart Contract was developed by the EnBW based on the white paper 'EnergyTokenModel'.
This paper describes how distributed ledger technology or blockchain can be used in the energy industry providing a basis for a blockchain based energy ecosystem in which use cases as i.e. energy sharing, proof of origin, local markets can be realized. The presented Smart Contact approach shows a way how real-world objects can be digitally mapped on a blockchain and how properties and transactions can be documented in a trustworthy way. The White Paper is currently available for download in German language [here](https://it-architecture.enbw.com/whitepaper-energy-token-model/).

The Blockchain identities are implemented with the [ERC725](https://github.com/ethereum/EIPs/issues/725) and [ERC735](https://github.com/ethereum/EIPs/issues/735) standards. The energy tokens are implemented with the [ERC1155](https://github.com/ethereum/EIPs/issues/1155) standard.

## Prerequisites

To run this project you need node.js installed on your system: https://nodejs.org/

## Cloning the repository

    git clone --recursive https://git.scc.kit.edu/ukdqp/blockchain-hackathon-enbw.git

## Installing Dependencies

    cd blockchain-hackathon-enbw
    npm install

    cd dependencies/jsmnSol
    npm install

## Set Up a local Chain with Ganache

### Alternative 1

- Download Ganache at https://www.trufflesuite.com/ganache#
- Install Ganache

Launch Ganache App:

- Workspace:

press "Add Project" and add the `truffle-config.js` from the root folder

- Server:

Make sure Hostname is `127.0.0.1 - IoO`

Change Port Number to: `8545`

- Accounts & Keys:

change (optinal): add the mnemonic (for easy setup and support scripts) "bread leave edge glide soda seat trim armed canyon rural cross scheme"

- CHAIN:

Change GAS LIMIT to: `10000000`

Select Hardfork: `Peterburg`

Start the Workspace

### Alternative 2

start a chain from a terminal with

    npx ganache-cli --gasLimit 10000000 -m "bread leave edge glide soda seat trim armed canyon rural cross scheme"

## Set Up MetaMask

Download MetaMask PlugIn
SetUp an Account on MetaMask
Select Properties -> Network -> Add Network
Enter a Name as the Networkname
New RPC-URL: `HTTP://127.0.0.1:8545`
Chain ID: `1337`

## Build & Run Application

-Commands to deploy the Contracts on Ganache

    truffle migrate

-Start the json-server

    node at ./mockServer/server.js // check path again

-Start the vue server

    npm run serve

## Testing

### Alternative 1

Launch Ganache:

npx ganache-cli -l 1000000000 -m "bread leave edge glide soda seat trim armed canyon rural cross scheme"

Copy sender address 0 from the list that's printed and replace the address in the line containing `from:` in `truffle-config.js` by it.

Copy private key 9 and change the definition of `account9Sk` at the top of `test/IdentityContract.test.js` to it.

Run the tests (in a different terminal instance):

    npx truffle deploy # required for tests to run successfully
    npx truffle test

### Alternative 2

```
    npm run build
    npm run tests
```
