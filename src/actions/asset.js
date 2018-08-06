/* global fetch */
/* eslint-disable camelcase */

import TruffleContract from 'truffle-contract'
import Market from '@oceanprotocol/keeper-contracts/build/contracts/OceanMarket'
import Auth from '@oceanprotocol/keeper-contracts/build/contracts/OceanAuth'
import EthCrypto from 'eth-crypto'

// var crypto = require("crypto-js");
// var eccrypto = require("eccrypto");

// const nRSA = require("node-rsa")
// const ethWallet = require("eth-crypto")

const DEFAULT_GAS = 300 * 1000

export function getOceanBackendURL(providers) {
    const { web3, ocnURL } = providers
    return ocnURL + '/assets'
}

export async function deployContracts(provider) {
    const market = TruffleContract(Market)
    market.setProvider(provider)
    const acl = TruffleContract(Auth)
    acl.setProvider(provider)
    return {
        market: await market.deployed(),
        acl: await acl.deployed()
    }
}

export async function publish(asset, market_contract, account, provider) {
    const { web3, ocnURL } = provider

    let account_address = account.name
    let assetId = ''
    // First, register on the keeper (on-chain)
    try {
        const id_str = asset.name + asset.description
        await market_contract.requestTokens(2000, { from: account_address})
        // try {
        //     let value = await market_contract.tokenBalance({from: account_address})
        //     console.log("balance: ", value)
        // } catch (e) {
        //     // await market_contract.requestTokens(2000, { from: account_address})
        //     // let value = await market_contract.tokenBalance({from: account_address})
        //
        //     console.log('got error calling market.tokenBalance', e.toString())
        // }

        assetId = await market_contract.generateId(id_str)
        console.log("about to do market.register: ", assetId, asset.price, account_address)
        await market_contract.register(
            assetId,
            asset.price, // price is zero for now.
            { from: account_address, gas: DEFAULT_GAS }
        )

    } catch (e) {
        console.error("Error registering the asset on-chain:", e)
        return
    }

    // Now register in oceandb and publish the metadata
    // prepare the asset json payload
    asset.id = assetId
    asset.publisher = account_address
    var jAsset = JSON.stringify({
        metadata: {
            name: asset.name,
            description: asset.description,
            links: asset.links,
            format: asset.format,
            size: asset.size,
            price: asset.price,
            url: asset.url,
        },
        assetId: asset.id,
        publisherId: asset.publisher,
        date: Date.now()
    })
    console.log('newasset to publish: ', jAsset, asset)
    let ocean_register_resource_url = getOceanBackendURL(provider) + '/metadata'
    fetch(ocean_register_resource_url, {
        method: 'POST',
        body: jAsset,
        headers: { 'Content-type': 'application/json' }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response))

}

export async function updateMetadata(asset, account, providers) {
    const { web3, ocnURL } = providers

    // get provider-backend url
    let update_url = ocnURL.api_url + '/assets/metadata'
    fetch(update_url, {
        method: 'PUT',
        body: JSON.stringify(asset),
        headers: { 'Content-type': 'application/json' }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response))
}

export async function list(contract, account, providers, own_assets_only=false) {

    let ocean_get_resource_ids_url = getOceanBackendURL(providers) + '/metadata'
    // console.log('provider url: ', ocean_get_resource_ids_url)
    var dbAssets = JSON.parse(await fetch(ocean_get_resource_ids_url, { method: 'GET' }).then( data => {return data.json()}))
    console.log('assets: ', dbAssets)
    dbAssets = Object.values(dbAssets)

    let filteredAssets = []
    for (var asset of dbAssets) {
        let valid = await contract.checkAsset(asset.assetId)
        if (valid) {
            filteredAssets.push(asset)
        }
    }
    dbAssets = filteredAssets
    console.log('assets (published on-chain): ', dbAssets)

    function myOwn(asset) {
        console.log("account: ", account.name)
        console.log("publisher: ", asset.publisherId)
        return asset.publisherId === account.name
    }
    if (account && own_assets_only) {
        dbAssets = dbAssets.filter(myOwn)
    }

    if (!!dbAssets) {
        return Object.values(dbAssets).map( (dbAsset) => ({
            ...dbAsset.metadata,
            id: dbAsset.assetId,
            publisher: dbAsset.publisherId,
            stats: {
                change: '+4.5%',
                accepted: '52%',
                rejected: '32.8%',
                challenged: '3',
                purchased: '142'
            },

        }))
    } else {
        return {};
    }

}


function watchAccessRequestEvent(account, aclContract, marketContract) {
    return async function watch1(error, result) {
        if (error) {
            console.log("Error in keeper event: ", error)
            return null
        }

        console.log("keeper event received: ", result)
        let accessId = 0x0
        accessId = result.args._id
        console.log('got new access request id: ', accessId)
        // TODO: save access request id to local store
    }
}

function watchAccessRequestCommittedEvent(account, asset, timeout, aclContract, marketContract) {
    return async  function watch2(error, result) {
        if (error) {
            console.log("Error in keeper event: ", error)
            return null
        }

        console.log("AccessRequestCommitted result: ", result, result.args._id);

        // id, expire, discovery, permissions, accessAgreementRef
        // Once the purchase agreement is fetched, display to the user to get confirmation to proceed with purchase
        let continuePurchase = window.confirm("Provider committed access consent. Click `Ok` to submit payment and complete the purchase transaction or `Cancel` to withdraw the access request.")
        if (continuePurchase) {
            // send payment
            let assetPrice = await marketContract.getAssetPrice(asset.id).then(function (price) {
                return price.toNumber();
            })
            console.log('sending payment: ', result.args._id, asset.publisher, assetPrice, timeout)
            marketContract.sendPayment(result.args._id, asset.publisher, assetPrice, timeout, {from: account.name})
        } else {
            aclContract.cancelAccessRequest(result.args._id, {from: account.name})
        }
    }
}

function watchAccessRequestRejectedEvent(account, aclContract, marketContract) {
    return async  function watch3(error, result) {
        if (error) {
            console.log("Error in keeper event: ", error)
            return null
        }

        console.log("access request rejected by provider: ", result)
        // update order status locally

    }

}


function watchPaymentReceivedEvent(account, aclContract, marketContract) {
    return async  function watch4(error, result) {
        if (error) {
            console.log("Error in keeper event: ", error)
            return null
        }

        console.log("payment received result: ", result);
    }

}

function watchEncryptedTokenPublishedEvent(account, web3, aclContract, marketContract, key) {
    return async  function watch5(error, result) {
        if (error) {
            console.log("Error in keeper event: ", error)
            return null
        }

        console.log("access token published by provider: ", result)
        // grab the access token from aclContract
        let encryptedToken = await aclContract.getEncryptedAccessToken(result.args._id, {from: account.name})
        // console.log('encrypted token: ', encryptedToken)
        // decrypt the token
        // let privKey = Buffer.from('0x' + key.toString())

        // console.log("key: ", key.toString(), privKey,  bitcore.PublicKey(key).toString(), encryptedToken)
        //
        // let accessToken = await eccrypto.decrypt(privKey, encryptedToken).then(function(tok) {return tok.toString();})

        // var myDecryptKey = ECIES().privateKey(key)
        // console.log("keys::::::::::; ", key, privKey, myDecryptKey, encryptedToken)
        // let accessToken = myDecryptKey.decrypt(encryptedToken)

        // encryptedToken = new Buffer(encryptedToken, 'hex')
        console.log("pub from priv: ", EthCrypto.publicKeyByPrivateKey(key.privateKey))
        // const encTokenStr = EthCrypto.cipher.stringify(encryptedToken)

        const encTokenStr = EthCrypto.cipher.parse(encryptedToken)
        let accessToken = EthCrypto.decryptWithPrivateKey(key.privateKey, encTokenStr)


        console.log('access token: ', accessToken)
        // sign it
        let signedToken = web3.eth.sign(account.name, accessToken)
        console.log('signed token: ', signedToken)
        // Download the data set from the provider using the url in the access token


    }
}


export async function purchase(asset, marketContract, aclContract, tokenContract, account, providers) {
    const { web3, ocnURL } = providers

    console.log('Purchasing asset by consumer: ', account.name, ' assetid: ', asset.id)

    let assetId = asset.id

    // Verify assetId is valid on-chain
    let isValid = await marketContract.checkAsset(assetId, { from: account.name})
    let assetPrice = await marketContract.getAssetPrice(assetId).then(function(price) {return price.toNumber();})
    console.log('is asset valid: ', isValid, ', asset price:', assetPrice)
    if (!isValid) {
        alert("this asset does not seem valid on-chain.")
        return false
    }

    // trigger purchaseResource on OceanAccessControl contract
    // TODO: allow user to set timeout through the UI.
    let timeout = (new Date().getTime() / 1000) + 3600 * 12 // 12 hours
    // generate temp key pair

    const key = EthCrypto.createIdentity()  //new nRSA({b: 512})
    let privateKey=key.privateKey  //exportKey()
    let publicKey=key.publicKey  //exportKey('public')
    let compressedKey = EthCrypto.publicKey.compress(publicKey)
    console.log('temp pub key: ', publicKey, compressedKey)

    // listen to keeper events
    var accessRequestedEvent = aclContract.AccessConsentRequested()
    var accessCommittedEvent = aclContract.AccessRequestCommitted()
    var accessRejectedEvent = aclContract.AccessRequestRejected()
    var paymentReceivedEvent = marketContract.PaymentReceived()
    var accessTokenPublishedEvent = aclContract.EncryptedTokenPublished()

    accessRequestedEvent.watch(watchAccessRequestEvent(account, aclContract, marketContract))
    accessCommittedEvent.watch(watchAccessRequestCommittedEvent(account, asset, timeout, aclContract, marketContract))
    accessRejectedEvent.watch(watchAccessRequestRejectedEvent(account, aclContract, marketContract))
    paymentReceivedEvent.watch(watchPaymentReceivedEvent(account, aclContract, marketContract))
    accessTokenPublishedEvent.watch(watchEncryptedTokenPublishedEvent(account, web3, aclContract, marketContract, key))

    // Allow OceanMarket contract to transfer funds on the consumer's behalf
    tokenContract.approve(marketContract.address, assetPrice, { from: account.name })
    let allowance = await tokenContract.allowance(account.name, marketContract.address).then(function(value) {return value.toNumber();})
    console.log('OceanMarket allowance: ', allowance)
    // Now we can start the access flow
    aclContract.initiateAccessRequest(assetId, asset.publisher, compressedKey,
        timeout, {from: account.name, gas: 6000000})

}


