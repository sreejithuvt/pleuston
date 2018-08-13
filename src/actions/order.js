/* global fetch */
/* eslint-disable camelcase */

import ethers from 'ethers'
import JWT from 'jsonwebtoken'
import EthEcies from '../cryptolibs/eth-ecies'


export async function list(contracts, account, providers) {
    let {market, acl} = contracts
    let eth_address = account.name
    let {web3, db, ocnURL } = providers

    let accessConsentEvent = acl.AccessConsentRequested({_consumer: account.name, })
    let orders = accessConsentEvent.get((error, events) => { return events} )

    return orders.map( (event) => ({
        id: event._id,
        consumer: event._consumer,
        provider: event._provider,
        assetId: event._resourceId,
        pubKey: event._pubKey,
        // committed, delivered, revoked
        status: acl.statusOfAccessRequest(event._id),
        timeout: event._timeout,
        paid: market.verifyPaymentReceived(event._id),
        key: null

        })
    )

}


export function watchAccessRequest(asset, contracts, account, providers) {
    let {market, acl} = contracts
    let eth_address = account.name
    let {web3, db, ocnURL} = providers

    const filter = {_resourceId: asset.id}
    var event = acl.AccessConsentRequested(filter)
    event.watch((error, result) => {
        if (error) {
            console.log('Error in keeper AccessConsentRequested event on asset: ', asset.id, '\nerror:', error)
        } else {
            console.log('keeper AccessConsentRequested event received on asset: ', asset.id, '\nresult:', result.args)
            let accessId = result.args._id
            console.log('got new access request id: ', accessId)
            // TODO: save new order with access request id to local store

            let order = {id: accessId, assetId: asset.id, asset: asset}
            watchAccessRequestCommitted(order, contracts, account, providers)
            // watchAccessRequestRejected(order, contracts, account)
        }

        // stop watching
        // event.stopWatching()
    })
}


export function watchAccessRequestCommitted(order, contracts, account, providers) {
    let {market, acl} = contracts
    let eth_address = account.name
    let {web3, db, ocnURL} = providers

    const filter = {_id: order.id}
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
                    let asset = order.asset
                    let assetPrice = await market.getAssetPrice(asset.id).then(function (price) {
                        return price.toNumber()
                    })
                    console.log('sending payment:  ', result.args._id, asset.publisher, assetPrice, order.timeout)
                    market.sendPayment(result.args._id, asset.publisher, assetPrice, order.timeout, {
                        from: account.name,
                        gas: 3000000
                    })

                    watchPaymentReceived(order, contracts, account, providers)

                } else {
                    acl.cancelAccessRequest(result.args._id, {from: account.name})
                }

            }

            // stop watching
            // event.stopWatching()
    }
    event.watch(callback)

}

export function watchAccessRequestRejected(order, contracts, account) {
    let {market, acl} = contracts
    let eth_address = account.name

    const filter = {_id: order.id}
    var event = acl.AccessRequestRejected(filter)
    const callback = async (error, result) => {
            if (error) {
                console.log('Error in keeper AccessRequestRejected event: ', order.id, error)
            } else {
                console.log('keeper AccessRequestRejected event received: ', order.id, result.args)

            }

            // stop watching
            // event.stopWatching()
    }
    event.watch(callback)

}

export function watchPaymentReceived(order, contracts, account, providers) {
    let {market, acl} = contracts
    let eth_address = account.name
    let {web3, db, ocnURL} = providers

    const filter = {_id: order.id}
    var event = market.PaymentReceived(filter)
    const callback = async (error, result) => {
            if (error) {
                console.log('Error in keeper PaymentReceived event: ', order.id, error)
            } else {
                console.log('keeper PaymentReceived event received: ', order.id, result.args)

            }

            watchEncryptedTokenPublished(order, contracts, account, providers)

            // stop watching
            // event.stopWatching()
    }
    event.watch(callback)

}

export function watchEncryptedTokenPublished(order, contracts, account, providers) {
    let {market, acl} = contracts
    let eth_address = account.name
    let {web3, db, ocnURL} = providers

    const filter = {_id: order.id}
    var event = acl.EncryptedTokenPublished(filter)
    const callback = async (error, result) => {
            if (error) {
                console.log('Error in keeper EncryptedTokenPublished event: ', order.id, error)
            } else {
                console.log('keeper EncryptedTokenPublished event received: ', order.id, result.args)

            }



            const { args } = result
            console.log('***************************************************')
            console.log(`access token published by provider: <${args._id}>`)
            console.log('***************************************************')
            const key = order.key
            let privateKey = key.privateKey.slice(2)
            // grab the access token from aclContract
            let encryptedToken = await acl.getEncryptedAccessToken(result.args._id, { from: account.name })
            let tokenNo0x = encryptedToken.slice(2)
            let encryptedTokenBuffer = Buffer.from(tokenNo0x, 'hex')
            let tokenLength = tokenNo0x.length
            console.log('encrypted token from keeper: ',
                '\nraw token', encryptedToken.toString('hex'), encryptedToken,
                '\nremoved 0x: ', tokenNo0x,
                '\ntoken buffer: ', encryptedTokenBuffer,
                '\nlength of token: ', tokenLength,
                '\nprivateKey: ', key.privateKey
            )
            console.log('***************************************************')
            console.log(`access token published by provider: <${tokenNo0x.slice(0, 10)}..${tokenNo0x.slice(tokenLength - 10)}>`)
            console.log('***************************************************')

            let accessTokenEncoded = EthEcies.Decrypt(Buffer.from(privateKey, 'hex'), encryptedTokenBuffer)
            let accessToken = JWT.decode(accessTokenEncoded) // Returns a json object
            console.log('access token: ', accessToken)

            // sign it
            // console.log('about to sign the token:',
            //     '\naccount.name: ', account.name, account.name.toString('hex')
            // )
            let hexEncrToken = `0x${encryptedTokenBuffer.toString('hex')}`
            // console.log('hex token: ', hexEncrToken)

            let signature = web3.eth.sign(account.name, hexEncrToken)
            const splitSignature = ethers.utils.splitSignature(signature)

            const fixedMsg = `\x19Ethereum Signed Message:\n${encryptedToken.length}${encryptedToken}`
            const fixedMsgSha = web3.sha3(fixedMsg)
            console.log('signed message hash from consumer to be validated: ', fixedMsgSha)

            const res = await acl.isSigned(account.name, fixedMsgSha, splitSignature.v, splitSignature.r,
                splitSignature.s, { from: order.asset.publisher })
            console.log('validate the signature  comes from consumer? isSigned: ', res)

            console.log('signature: ', signature, splitSignature.v, splitSignature.r, splitSignature.s,
                // '\nfixedMsg: ', fixedMsg,
                '\nmsgSha: ', fixedMsgSha)

            // Download the data set from the provider using the url in the access token
            // decode the access token, grab the service_endpoint, request_id,
            const provider_url = `${accessToken.service_endpoint}/${accessToken.resource_id}`

            // payload keys: ['consumerId', 'fixed_msg', 'sigEncJWT', 'jwt']
            const payload = {
                jwt: accessTokenEncoded,
                consumerId: account.name,
                fixed_msg: fixedMsgSha,
                sigEncJWT: signature
            }
            const fetchParams = {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-type': 'application/json' }

            }
            // TODO: this fails for some reason, need to debug and fix it.
            console.log('Consuming resource from: ', JSON.stringify(payload), '\n', provider_url)
            await fetch(provider_url, fetchParams).then(res => res.toString())
                .catch(error => console.error('Error  :', error))
                .then(consumption_url => {
                    console.log('Success accessing consume endpoint:', consumption_url)
                })



            // stop watching
            // event.stopWatching()
    }

    event.watch(callback)

}
