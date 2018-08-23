import Web3 from 'web3'
import TruffleContract from 'truffle-contract'

const OceanToken = require('@oceanprotocol/keeper-contracts/artifacts/OceanToken.development')
const OceanMarket = require('@oceanprotocol/keeper-contracts/artifacts/OceanMarket.development')
const OceanAuth = require('@oceanprotocol/keeper-contracts/artifacts/OceanAuth.development')

const DEFAULT_GAS = 300000

export default class OceanKeeper {
    constructor(uri) {
        const web3Provider = new Web3.providers.HttpProvider(uri)
        this.web3 = new Web3(web3Provider)
        this.defaultGas = DEFAULT_GAS
    }

    async initContracts() {
        const oceanToken = TruffleContract(OceanToken)
        const oceanMarket = TruffleContract(OceanMarket)
        const oceanAuth = TruffleContract(OceanAuth)
        oceanToken.setProvider(this.web3)
        oceanMarket.setProvider(this.web3)
        oceanAuth.setProvider(this.web3)
        const contracts = {
            oceanToken: await oceanToken.at(OceanToken.address),
            oceanMarket: await oceanMarket.at(OceanMarket.address),
            oceanAuth: await oceanAuth.at(OceanAuth.address)
        }
        this.oceanToken = contracts.oceanToken
        this.oceanMarket = contracts.oceanMarket
        this.oceanAuth = contracts.oceanAuth
        return contracts
    }

    getBalance(accountAddress) {
        return this.oceanToken.balanceOf.call(accountAddress)
    }

    requestTokens(accountAddress, numTokens) {
        return this.oceanMarket.requestTokens(numTokens, { from: accountAddress })
    }

    checkAsset(assetId) {
        return this.oceanMarket.checkAsset(assetId)
    }

    async registerDataAsset(name, description, price, accountAddress) {
        const assetId = await this.oceanMarket.generateId(name + description)
        const result = await this.oceanMarket.register(
            assetId,
            price,
            { from: accountAddress, gas: this.defaultGas }
        )
        console.log('registered: ', result)
        return assetId
    }
}
