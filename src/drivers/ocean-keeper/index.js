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

    getBalance(accountAddress) {
        return this.oceanToken.balanceOf.call(accountAddress)
    }

    requestTokens(accountAddress, numTokens) {
        return this.oceanMarket.requestTokens(numTokens, { from: accountAddress })
    }

    checkAsset(assetId) {
        return this.oceanMarket.checkAsset(assetId)
    }

    getAssetPrice(assetId) {
        return this.oceanMarket.getAssetPrice(assetId).then((price) => price.toNumber())
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

    signMessage(accountAddress, message) {
        return this.web3.eth.sign(accountAddress, message)

    }

    getMessageHash(message) {
        return this.web3.sha3(`\x19Ethereum Signed Message:\n${message.length}${message}`)
    }

    getEncryptedAccessToken(orderId, senderAddress) {
        this.oceanAuth.getEncryptedAccessToken(orderId, { from: senderAddress })
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

    async orchestrateResourcePurchase(
        assetId, publisherId, price, privateKey, publicKey, timeout, accountAddress,
        initialRequestEventHandler, accessCommittedEventHandler, tokenPublishedEventHandler) {
        // Allow OceanMarket contract to transfer funds on the consumer's behalf
        this.oceanToken.approve(this.oceanMarket.address, price, { from: accountAddress, gas: 3000000 })
        // Submit the access request
        this.oceanAuth.initiateAccessRequest(
            assetId, publisherId, publicKey,
            timeout, { from: accountAddress, gas: 1000000 }
        )

        const resourceFilter = { _resourceId: assetId, _consumer: accountAddress }
        const initRequestEvent = this.oceanAuth.AccessConsentRequested(resourceFilter)
        let order = {}
        this._listenOnce(
            initRequestEvent,
            'AccessConsentRequested',
            (result) => {
                order = initialRequestEventHandler(result)
                const requestIdFilter = { _id: order.id }
                const accessCommittedEvent = this.oceanAuth.AccessRequestCommitted(requestIdFilter)
                const tokenPublishedEvent = this.oceanAuth.EncryptedTokenPublished(requestIdFilter)
                this._listenOnce(
                    accessCommittedEvent,
                    'AccessRequestCommitted',
                    (result) => {
                        accessCommittedEventHandler(result, order)
                    }
                )
                this._listenOnce(
                    tokenPublishedEvent,
                    'EncryptedTokenPublished',
                    (result) => {
                        tokenPublishedEventHandler(result, order)
                    }
                )
            })
        return order
    }

    _listenOnce(event, eventName, callback) {
        event.watch((error, result) => {
            event.stopWatching()
            if (error) {
                console.log(`Error in keeper ${eventName} event for order ${this.order}: `, error)
                this.reject(error)
                throw new Error(`Error encountered while processing this purchase request: ${error}`)
            } else {
                callback(result)
            }
        })
    }

}
