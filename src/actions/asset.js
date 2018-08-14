/* global fetch */
/* eslint-disable camelcase */

import TruffleContract from 'truffle-contract'
import ethjs_util from 'ethereumjs-util'
import EthCrypto from '../lib/eth-crypto'

import Market from '@oceanprotocol/keeper-contracts/artifacts/OceanMarket.development'
import Auth from '@oceanprotocol/keeper-contracts/artifacts/OceanAuth.development'
import { watchAccessRequest } from './order'

const DEFAULT_GAS = 300 * 1000

export function getOceanBackendURL(providers) {
    const { ocnURL } = providers
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
    let account_address = account.name
    let assetId = ''
    // First, register on the keeper (on-chain)
    try {
        const id_str = asset.name + asset.description
        await market_contract.requestTokens(2000, { from: account_address })
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
        console.log('about to do market.register: ', assetId, asset.price, account_address)
        await market_contract.register(
            assetId,
            asset.price, // price is zero for now.
            { from: account_address, gas: DEFAULT_GAS }
        )
    } catch (e) {
        console.error('Error registering the asset on-chain:', e)
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
            url: asset.url
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
    const { ocnURL } = providers

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

export async function list(contract, account, providers) {
    let ocean_get_resource_ids_url = getOceanBackendURL(providers) + '/metadata'
    // console.log('provider url: ', ocean_get_resource_ids_url)
    var dbAssets = JSON.parse(await fetch(ocean_get_resource_ids_url, { method: 'GET' }).then(data => {
        return data.json()
    }))
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

    if (dbAssets) {
        return Object.values(dbAssets).map((dbAsset) => ({
            ...dbAsset.metadata,
            id: dbAsset.assetId,
            publisher: dbAsset.publisherId,
            stats: {
                change: '+4.5%',
                accepted: '52%',
                rejected: '32.8%',
                challenged: '3',
                purchased: '142'
            }

        }))
    } else {
        return {}
    }
}

export async function purchase(asset, contracts, account, providers) {
    // const { web3 } = providers
    let { market, acl, oceanToken } = contracts

    console.log('Purchasing asset by consumer: ', account.name, ' assetid: ', asset.id)

    let assetId = asset.id

    // Verify assetId is valid on-chain
    let isValid = await market.checkAsset(assetId, { from: account.name })
    let assetPrice = await market.getAssetPrice(assetId).then(function(price) {
        return price.toNumber()
    })
    console.log('is asset valid: ', isValid, ', asset price:', assetPrice)
    if (!isValid) {
        window.alert('this asset does not seem valid on-chain.')
        return false
    }

    // trigger purchaseResource on OceanAccessControl contract
    // TODO: allow user to set timeout through the UI.
    let timeout = (new Date().getTime() / 1000) + 3600 * 12 // 12 hours
    // generate temp key pair

    const key = EthCrypto.createIdentity()
    let { privateKey, publicKey } = key
    publicKey = ethjs_util.privateToPublic(privateKey).toString('hex')

    // Allow OceanMarket contract to transfer funds on the consumer's behalf
    oceanToken.approve(market.address, assetPrice, { from: account.name, gas: 3000000 })
    let allowance = await oceanToken.allowance(account.name, market.address).then(function(value) {
        return value.toNumber()
    })
    console.log('OceanMarket allowance: ', allowance)
    // Now we can start the access flow
    acl.initiateAccessRequest(assetId, asset.publisher, publicKey,
        timeout, { from: account.name, gas: 1000000 })

    watchAccessRequest(asset, contracts, account, providers, key)
}
