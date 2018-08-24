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
        oceanToken.setProvider(this.web3.currentProvider)
        oceanMarket.setProvider(this.web3.currentProvider)
        oceanAuth.setProvider(this.web3.currentProvider)
        this.oceanToken = await oceanToken.at(OceanToken.address)
        this.oceanMarket = await oceanMarket.at(OceanMarket.address)
        this.oceanAuth = await oceanAuth.at(OceanAuth.address)

        return {
            oceanToken: this.oceanToken,
            oceanMarket: this.oceanMarket,
            oceanAuth: this.oceanAuth
        }
    }

    // web3 wrappers
    sign(accountAddress, message) {
        return this.web3.eth.sign(accountAddress, message)
    }

    getMessageHash(message) {
        return this.web3.sha3(`\x19Ethereum Signed Message:\n${message.length}${message}`)
    }

    // call functions (costs no gas)
    checkAsset(assetId) {
        return this.oceanMarket.checkAsset(assetId)
    }

    getBalance(accountAddress) {
        return this.oceanToken.balanceOf.call(accountAddress)
    }

    getAssetPrice(assetId) {
        return this.oceanMarket.getAssetPrice(assetId).then((price) => price.toNumber())
    }

    getEncryptedAccessToken(orderId, senderAddress) {
        this.oceanAuth.getEncryptedAccessToken(orderId, { from: senderAddress })
    }

    // Transactions with gas cost
    requestTokens(senderAddress, numTokens) {
        return this.oceanMarket.requestTokens(numTokens, { from: senderAddress })
    }

    async registerDataAsset(name, description, price, publisherAddress) {
        const assetId = await this.oceanMarket.generateId(name + description)
        const result = await this.oceanMarket.register(
            assetId,
            price,
            { from: publisherAddress, gas: this.defaultGas }
        )
        console.log('registered: ', result)
        return assetId
    }

    async sendPayment(assetId, order, publisherAddress, senderAddress) {
        let assetPrice = await this.oceanMarket.getAssetPrice(assetId).then((price) => price.toNumber())
        this.oceanMarket.sendPayment(order.id, publisherAddress, assetPrice, order.timeout, {
            from: senderAddress,
            gas: 5000000
        })
    }

    cancelAccessRequest(orderId, senderAddress) {
        return this.oceanAuth.cancelAccessRequest(orderId, {from: senderAddress})
    }

    orchestrateResourcePurchase(
        assetId, publisherId, price, privateKey, publicKey, timeout, senderAddress,
        initialRequestEventHandler, accessCommittedEventHandler, tokenPublishedEventHandler) {
        const { oceanToken, oceanMarket, oceanAuth } = this
        // Allow OceanMarket contract to transfer funds on the consumer's behalf
        oceanToken.approve(oceanMarket.address, price, { from: senderAddress, gas: 3000000 })
        // Submit the access request
        oceanAuth.initiateAccessRequest(
            assetId, publisherId, publicKey,
            timeout, { from: senderAddress, gas: 1000000 }
        )

        const resourceFilter = { _resourceId: assetId, _consumer: senderAddress }
        const initRequestEvent = oceanAuth.AccessConsentRequested(resourceFilter)
        let order = {}
        this._listenOnce(
            initRequestEvent,
            'AccessConsentRequested',
            (result, error) => {
                order = initialRequestEventHandler(result, error)
                const requestIdFilter = { _id: order.id }
                const accessCommittedEvent = oceanAuth.AccessRequestCommitted(requestIdFilter)
                const tokenPublishedEvent = oceanAuth.EncryptedTokenPublished(requestIdFilter)
                this._listenOnce(
                    accessCommittedEvent,
                    'AccessRequestCommitted',
                    (result, error) => {
                        accessCommittedEventHandler(result, order, error)
                    }
                )
                this._listenOnce(
                    tokenPublishedEvent,
                    'EncryptedTokenPublished',
                    (result, error) => {
                        tokenPublishedEventHandler(result, order, error)
                    }
                )
            })
        return order
    }

    // Helper functions (private)
    static _listenOnce(event, eventName, callback) {
        event.watch((error, result) => {
            event.stopWatching()
            if (error) {
                console.log(`Error in keeper ${eventName} event: `, error)
            }
            callback(result, error)
        })
    }

}
