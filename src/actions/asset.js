/* global fetch */

import TruffleContract from 'truffle-contract'
import EthjsUtil from 'ethereumjs-util'
import EthCrypto from '../lib/eth-crypto'

import Market from '@oceanprotocol/keeper-contracts/build/contracts/OceanMarket'
import Auth from '@oceanprotocol/keeper-contracts/build/contracts/OceanAuth'
import { watchAccessRequest } from './order'

const DEFAULT_GAS = 1000 * 1000

export function getOceanBackendURL(providers) {
    const { ocnURL } = providers
    return ocnURL + '/assets'
}

export async function deployContracts(provider) {
    const market = TruffleContract(Market)
    const acl = TruffleContract(Auth)

    market.setProvider(provider)
    acl.setProvider(provider)

    return {
        market: await market.deployed(),
        acl: await acl.deployed()
    }
}

export async function publish(asset, marketContract, account, provider) {
    // First, register on the keeper (on-chain)
    await marketContract.requestTokens(2000, { from: account.name })

    const assetId = await marketContract.generateId(asset.name + asset.description)

    await marketContract.register(
        assetId,
        asset.price, // price is zero for now.
        { from: account.name, gas: DEFAULT_GAS }
    )

    // Now register in oceandb and publish the metadata
    fetch(`${getOceanBackendURL(provider)}/metadata`,
        {
            method: 'POST',
            body: JSON.stringify({
                assetId,
                metadata: {
                    name: asset.name,
                    description: asset.description,
                    links: asset.links,
                    format: asset.format,
                    size: asset.size,
                    price: asset.price,
                    url: asset.url
                },
                publisherId: asset.publisher,
                date: Math.round((new Date()).getTime())
            }),
            headers: { 'Content-type': 'application/json' }
        })
        .then(res => res.json())
        .then(response => console.log('Success:', response))
}

export async function list(contract, account, provider) {
    let getMetadataUrl = `${getOceanBackendURL(provider)}/metadata`
    let dbAssets = await fetch(getMetadataUrl, { method: 'GET' })
        .then(res => res.json())
        .then(resJson => JSON.parse(resJson))

    return Object.values(dbAssets)
        .filter(async (asset) => contract.checkAsset(asset.assetId))
}

export async function purchase(asset, contracts, account, providers) {
    const { web3 } = providers
    let { market, acl, oceanToken } = contracts

    console.log('Purchasing asset by consumer: ', account.name, ' assetid: ', asset.assetId)

    // Verify asset.assetId is valid on-chain
    const isValid = await market.checkAsset(asset.assetId, { from: account.name })
    const assetPrice = await market.getAssetPrice(asset.assetId).then(function(price) {
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
    publicKey = EthjsUtil.privateToPublic(privateKey).toString('hex')

    // Allow OceanMarket contract to transfer funds on the consumer's behalf
    oceanToken.approve(market.address, assetPrice, { from: account.name, gas: 3000000 })
    let allowance = await oceanToken.allowance(account.name, market.address).then(function(value) { return value.toNumber() })
    console.log('OceanMarket allowance: ', allowance)
    // Now we can start the access flow
    acl.initiateAccessRequest(asset.assetId, asset.publisher, publicKey,
        timeout, { from: account.name, gas: 1000000 })

    watchAccessRequest(asset, contracts, account, web3, key)
}
