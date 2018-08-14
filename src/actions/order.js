/* global fetch */

import JWT from 'jsonwebtoken'
import EthEcies from '../cryptolibs/eth-ecies'

export async function buildOrdersFromEvents(events, acl, market, account) {
    return events
        .filter(obj => {
            return (obj.args._consumer === account.name)
        })
        .map(async (event) => ({
            ...event.args,
            status: (await acl.statusOfAccessRequest(event.args._id)),
            paid: (await market.verifyPaymentReceived(event.args._id)),
            key: null
        }))
}

export function watchAccessRequest(asset, contracts, account, web3, key) {
    let { acl } = contracts

    const filter = { _resourceId: asset.assetId }
    var event = acl.AccessConsentRequested(filter)
    event.watch((error, result) => {
        if (error) {
            console.log('Error in keeper AccessConsentRequested event on asset: ', asset.assetId, '\nerror:', error)
        } else {
            console.log('keeper AccessConsentRequested event received on asset: ', asset.assetId, '\nresult:', result.args)
            let accessId = result.args._id
            console.log('got new access request id: ', accessId)
            // TODO: save new order with access request id to local store

            let order = {
                id: accessId,
                assetId: asset.assetId,
                asset: asset,
                timeout: result.args._timeout,
                pubkey: result.args._pubKey,
                key: key
            }
            watchAccessRequestCommitted(order, contracts, account, web3)
            // watchAccessRequestRejected(order, contracts, account)
        }

        // stop watching
        event.stopWatching()
    })
}

export function watchAccessRequestCommitted(order, contracts, account, web3) {
    let { market, acl } = contracts

    const filter = { _id: order.id }
    var event = acl.AccessRequestCommitted(filter)
    const callback = async (error, result) => {
        if (error) {
            console.log('Error in keeper AccessRequestCommitted event: ', order.id, error)
        } else {
            console.log('keeper AccessRequestCommitted event received: ', order.id, result.args)
            // id, expire, discovery, permissions, accessAgreementRef
            // Once the purchase agreement is fetched, display to the user to get confirmation to proceed with purchase
            let continuePurchase = window.confirm(
                `Provider committed access consent for resource ${order.assetId} ` +
                    `Click [Ok] to submit payment ` +
                    `and complete the purchase transaction or [Cancel] to withdraw the access request.`
            )
            if (continuePurchase) {
                // send payment
                let { asset } = order
                let assetPrice = await market.getAssetPrice(asset.assetId).then(function(price) {
                    return price.toNumber()
                })
                console.log('sending payment:  ', result.args._id, asset.publisherId, assetPrice, order.timeout)
                market.sendPayment(result.args._id, asset.publisherId, assetPrice, order.timeout, {
                    from: account.name,
                    gas: 5000000
                })

                watchPaymentReceived(order, contracts, account, web3)
            } else {
                acl.cancelAccessRequest(result.args._id, { from: account.name })
            }
        }

        // stop watching
        event.stopWatching()
    }
    event.watch(callback)
}

export function watchAccessRequestRejected(order, contracts, account) {
    let { acl } = contracts

    const filter = { _id: order.id }
    var event = acl.AccessRequestRejected(filter)
    const callback = async (error, result) => {
        if (error) {
            console.log('Error in keeper AccessRequestRejected event: ', order.id, error)
        } else {
            console.log('keeper AccessRequestRejected event received: ', order.id, result.args)
        }

        event.stopWatching()
    }
    event.watch(callback)
}

export function watchPaymentReceived(order, contracts, account, web3) {
    let { market } = contracts

    const filter = { _id: order.id }
    var event = market.PaymentReceived(filter)
    const callback = async (error, result) => {
        if (error) {
            console.log('Error in keeper PaymentReceived event: ', order.id, error)
        } else {
            console.log('keeper PaymentReceived event received: ', order.id, result.args)
        }

        watchEncryptedTokenPublished(order, contracts, account, web3)

        // stop watching
        event.stopWatching()
    }
    event.watch(callback)
}

export function watchEncryptedTokenPublished(order, contracts, account, web3) {
    let { acl } = contracts
    // let eth_address = account.name

    const filter = { _id: order.id }
    const event = acl.EncryptedTokenPublished(filter)
    event.watch(async (error, result) => {
        if (error) {
            console.log('Error in keeper EncryptedTokenPublished event: ', order.id, error)
            return null
        } else {
            console.log('keeper EncryptedTokenPublished event received: ', order.id, result.args)
        }

        const { key } = order
        let privateKey = key.privateKey.slice(2)

        // grab the access token from acl contract
        let encryptedToken = await acl.getEncryptedAccessToken(result.args._id, { from: account.name })
        let tokenNo0x = encryptedToken.slice(2)
        let encryptedTokenBuffer = Buffer.from(tokenNo0x, 'hex')

        // stop watching
        event.stopWatching()

        let accessTokenEncoded = EthEcies.Decrypt(Buffer.from(privateKey, 'hex'), encryptedTokenBuffer)
        let accessToken = JWT.decode(accessTokenEncoded) // Returns a json object
        console.log('access token: ', accessToken)

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
        const consumeURL = await fetch(`${accessToken.service_endpoint}/${accessToken.resource_id}`,
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

        console.log('consume url: ', consumeURL)
    })
}
