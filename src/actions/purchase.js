/* global fetch */

import EthEcies from '../lib/eth-ecies'
import JWT from 'jsonwebtoken'
import EthCrypto from 'eth-crypto'
import EthjsUtil from 'ethereumjs-util'

export default class PurchaseHandler {
    constructor(asset, account, oceanKeeper) {
        this.asset = asset
        this.order = {}
        this.account = account
        this.oceanKeeper = oceanKeeper
        // this.web3 = web3
        this.key = EthCrypto.createIdentity()

        this.orderPromise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        })
    }

    async doPurchase() {
        const { asset, oceanKeeper, account, key } = this
        // Verify asset.assetId is valid on-chain
        const isValid = await oceanKeeper.checkAsset(asset.assetId)
        const assetPrice = await oceanKeeper.getAssetPrice(asset.assetId)
        console.log('is asset valid: ', asset.assetId, isValid, ', asset price:', assetPrice)
        // AUDIT: not sure why this is false, the asset is clearly valid on-chain
        // if (!isValid) {
        //     window.alert('this asset does not seem  valid on-chain.')
        //     return false
        // }

        // trigger purchaseResource on OceanAccessControl contract
        // TODO: allow user to set timeout through the UI.
        const timeout = (new Date().getTime() / 1000) + 3600 * 12 // 12 hours
        // generate temp key pair
        const { privateKey } = key
        const publicKey = EthjsUtil.privateToPublic(privateKey).toString('hex')
        oceanKeeper.orchestrateResourcePurchase(
            asset.assetId, asset.publisherId, assetPrice, privateKey, publicKey, timeout, account.name,
            this.handleAccessRequestEvent.bind(this), this.handleAccessCommittedEvent.bind(this), this.finalizePurchase.bind(this))

        return this.orderPromise
    }

    handleError(error) {
        this.reject(error)
        throw new Error(`Error encountered while processing this purchase request: ${error}`)
    }

    handleAccessRequestEvent(eventResult, error) {
        if (error) {
            this.handleError(error)
        }
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

    async handleAccessCommittedEvent(eventResult, order, error) {
        if (error) {
            this.handleError(error)
        }
        const { asset, oceanKeeper, account } = this
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
            console.log('sending payment:  ', eventResult.args._id, asset.publisherId, asset.price, order.timeout)
            oceanKeeper.sendPayment(asset.assetId, order, asset.publisherId, account.name)
        } else {
            oceanKeeper.cancelAccessRequest(eventResult.args._id, account.name)
            this.reject('user cancelled purchase.')
        }
    }

    async finalizePurchase(eventResult, order, error) {
        if (error) {
            this.handleError(error)
        }
        const { oceanKeeper, account, key } = this
        // console.log('keeper EncryptedTokenPublished event received: ', order.id, eventResult.args)
        const privateKey = key.privateKey.slice(2)

        const encryptedAccessToken = await oceanKeeper.getEncryptedAccessToken(eventResult.args._id, account.name)

        // grab the access token from acl contract
        let tokenNo0x = encryptedAccessToken.slice(2)
        let encryptedTokenBuffer = Buffer.from(tokenNo0x, 'hex')

        let accessTokenEncoded = EthEcies.Decrypt(Buffer.from(privateKey, 'hex'), encryptedTokenBuffer)
        let accessToken = JWT.decode(accessTokenEncoded) // Returns a json object

        // sign it
        let hexEncrToken = `0x${encryptedTokenBuffer.toString('hex')}`

        let signature = oceanKeeper.sign(account.name, hexEncrToken)
        const fixedMsgSha = oceanKeeper.getMessageHash(encryptedAccessToken)

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
