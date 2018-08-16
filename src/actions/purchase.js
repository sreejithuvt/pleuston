/* global fetch */

import EthEcies from '../cryptolibs/eth-ecies'
import JWT from 'jsonwebtoken'
import EthCrypto from '../lib/eth-crypto'
import EthjsUtil from 'ethereumjs-util'

export default class PurchaseHandler {
    constructor(asset, order, contracts, account, web3) {
        this.asset = asset
        this.order = order || {}
        const { market, acl, oceanToken } = contracts
        this.market = market
        this.acl = acl
        this.oceanToken = oceanToken
        this.account = account
        this.web3 = web3
        this.key = EthCrypto.createIdentity()

        this.orderPromise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        })
    }

    async doPurchase() {
        const { asset, market, acl, oceanToken, account, key } = this
        // Verify asset.assetId is valid on-chain
        const isValid = await market.checkAsset(asset.assetId)
        const assetPrice = await market.getAssetPrice(asset.assetId).then(function(price) {
            return price.toNumber()
        })
        console.log('is asset valid: ', asset.assetId, isValid, ', asset price:', assetPrice)
        // AUDIT: not sure why this is false, the asset is clearly valid on-chain
        // if (!isValid) {
        //     window.alert('this asset does not seem  valid on-chain.')
        //     return false
        // }

        // trigger purchaseResource on OceanAccessControl contract
        // TODO: allow user to set timeout through the UI.
        let timeout = (new Date().getTime() / 1000) + 3600 * 12 // 12 hours

        // generate temp key pair
        let { privateKey, publicKey } = key
        publicKey = EthjsUtil.privateToPublic(privateKey).toString('hex')

        // Allow OceanMarket contract to transfer funds on the consumer's behalf
        oceanToken.approve(market.address, assetPrice, { from: account.name, gas: 3000000 })
        let allowance = await oceanToken.allowance(account.name, market.address).then(function(value) { return value.toNumber() })
        console.log('OceanMarket allowance: ', allowance, timeout, asset.assetId, asset.publisherId)
        // Now we can start the access flow
        acl.initiateAccessRequest(asset.assetId, asset.publisherId, publicKey,
            timeout, { from: account.name, gas: 1000000 })

        const resourceFilter = { _resourceId: asset.assetId, _consumer: account.name }
        const initRequestEvent = acl.AccessConsentRequested(resourceFilter)
        this.listenOnce(
            initRequestEvent,
            'AccessConsentRequested',
            (result) => {
                this.order = this.handleAccessRequestEvent(result)
                const requestIdFilter = { _id: this.order.id }
                const accessCommittedEvent = acl.AccessRequestCommitted(requestIdFilter)
                const tokenPublishedEvent = acl.EncryptedTokenPublished(requestIdFilter)
                this.listenOnce(
                    accessCommittedEvent,
                    'AccessRequestCommitted',
                    (result) => {
                        this.handleAccessCommittedEvent(result)
                    }
                )
                this.listenOnce(
                    tokenPublishedEvent,
                    'EncryptedTokenPublished',
                    (result) => {
                        this.finalizePurchase(result)
                    }
                )
            })

        return this.orderPromise
    }

    listenOnce(event, eventName, callback) {
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

    handleAccessRequestEvent(eventResult) {
        const { asset, key } = this
        console.log('keeper AccessConsentRequested event received on asset: ', asset.assetId, '\nevent:', eventResult.args)
        const accessId = eventResult.args._id
        console.log('got new access request id: ', accessId)
        return { // order object
            id: accessId,
            assetId: asset.assetId,
            asset: asset,
            timeout: eventResult.args._timeout,
            pubkey: eventResult.args._pubKey,
            key: key
        }
    }

    async handleAccessCommittedEvent(eventResult) {
        const { asset, market, acl, account } = this
        let { order } = this
        console.log('keeper AccessRequestCommitted event received: ', order.id, eventResult.args)
        // id, expire, discovery, permissions, accessAgreementRef
        // Once the purchase agreement is fetched, display to the user to get confirmation to proceed with purchase
        let continuePurchase = window.confirm(
            `Provider committed access consent for resource ${order.assetId}.\n ` +
            `Click \n  [Ok] to submit payment ` +
            `and complete the purchase transaction or \n  [Cancel] to withdraw the access request.`
        )
        if (continuePurchase) {
            // send payment
            let assetPrice = await market.getAssetPrice(asset.assetId).then((price) => price.toNumber())
            console.log('sending payment:  ', eventResult.args._id, asset.publisherId, assetPrice, order.timeout)
            market.sendPayment(eventResult.args._id, asset.publisherId, assetPrice, order.timeout, {
                from: account.name,
                gas: 5000000
            })
        } else {
            acl.cancelAccessRequest(eventResult.args._id, { from: account.name })
            this.reject('user cancelled purchase.')
        }
    }

    async finalizePurchase(eventResult) {
        const { acl, account, key, web3 } = this
        let { order } = this
        // console.log('keeper EncryptedTokenPublished event received: ', order.id, eventResult.args)
        let privateKey = key.privateKey.slice(2)

        // grab the access token from acl contract
        let encryptedToken = await acl.getEncryptedAccessToken(eventResult.args._id, { from: account.name })
        let tokenNo0x = encryptedToken.slice(2)
        let encryptedTokenBuffer = Buffer.from(tokenNo0x, 'hex')

        let accessTokenEncoded = EthEcies.Decrypt(Buffer.from(privateKey, 'hex'), encryptedTokenBuffer)
        let accessToken = JWT.decode(accessTokenEncoded) // Returns a json object
        // console.log('access token: ', accessToken)

        // sign it
        let hexEncrToken = `0x${encryptedTokenBuffer.toString('hex')}`

        let signature = web3.eth.sign(account.name, hexEncrToken)
        const fixedMsg = `\x19Ethereum Signed Message:\n${encryptedToken.length}${encryptedToken}`
        const fixedMsgSha = web3.sha3(fixedMsg)

        // Download the data set from the provider using the url in the access token
        // decode the access token, grab the service_endpoint, request_id,

        // payload keys: ['consumerId', 'fixed_msg', 'sigEncJWT', 'jwt']
        const payload = JSON.stringify({
            jwt: accessTokenEncoded,
            consumerId: account.name,
            fixed_msg: fixedMsgSha,
            sigEncJWT: signature
        })
        const accessUrl = await fetch(`${accessToken.service_endpoint}/${accessToken.resource_id}`,
            {
                method: 'POST',
                body: payload,
                headers: { 'Content-type': 'application/json' }
            }
        )
            .then(response => {
                if (response.ok) {
                    return response.text()
                }
                console.log('Failed: ', response.status, response.statusText)
                window.alert(`Sorry, fetching the data asset consumption url failed: ${response.statusText}`)
            })
            .then(consumptionUrl => {
                console.log('Success accessing consume endpoint:', consumptionUrl)
                return consumptionUrl
            })
            .catch(error => {
                console.error('Error fetching the data asset consumption url:', error)
                window.alert(`Sorry, fetching the data asset consumption url failed: ${error.message}`)
            })
        console.log('consume url: ', accessUrl)
        order.accessUrl = accessUrl
        this.resolve(order)
    }
}
