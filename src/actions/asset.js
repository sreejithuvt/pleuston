import TruffleContract from 'truffle-contract'
import EthjsUtil from 'ethereumjs-util'
import EthCrypto from '../lib/eth-crypto'

import Market from '@oceanprotocol/keeper-contracts/build/contracts/OceanMarket'
import Auth from '@oceanprotocol/keeper-contracts/build/contracts/OceanAuth'
import { watchAccessRequest } from './order'

const DEFAULT_GAS = 1000 * 1000

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

export async function publish(asset, marketContract, account, providers) {
    const { oceanAgent } = providers
    // First, register on the keeper (on-chain)
    await marketContract.requestTokens(2000, { from: account.name })

    const assetId = await marketContract.generateId(asset.name + asset.description)

    await marketContract.register(
        assetId,
        asset.price, // price is zero for now.
        { from: account.name, gas: DEFAULT_GAS }
    )

    // Now register in oceandb and publish the metadata
    oceanAgent.publishDataAsset(
        {
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
        }
    )
}

export async function list(contract, account, providers) {
    const { oceanAgent } = providers
    var dbAssets = oceanAgent.getAssetsMetadata()
    console.log('assets: ', dbAssets)

    dbAssets = Object.values(dbAssets).filter(async (asset) => { return contract.checkAsset(asset.assetId) })
    console.log('assets (published on-chain): ', dbAssets)

    if (dbAssets) {
        return Object.values(dbAssets).map((dbAsset) => ({
            ...dbAsset.metadata,
            id: dbAsset.assetId,
            publisher: dbAsset.publisherId,

        }))
    } else {
        return {}
    }
}

export async function purchase(asset, contracts, account, providers) {
    const { web3 } = providers
    let { market, acl, oceanToken } = contracts

    console.log('Purchasing asset by consumer: ', account.name, ' assetid: ', asset.id)

    // Verify asset.id is valid on-chain
    const isValid = await market.checkAsset(asset.id, { from: account.name })
    const assetPrice = await market.getAssetPrice(asset.id).then(function(price) {
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
    acl.initiateAccessRequest(asset.id, asset.publisher, publicKey,
        timeout, { from: account.name, gas: 1000000 })

    watchAccessRequest(asset, contracts, account, web3, key)
}
