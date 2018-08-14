import TruffleContract from 'truffle-contract'
import EthjsUtil from 'ethereumjs-util'
import EthCrypto from '../lib/eth-crypto'

import Market from '@oceanprotocol/keeper-contracts/build/contracts/OceanMarket'
import Auth from '@oceanprotocol/keeper-contracts/build/contracts/OceanAuth'
import AssetModel from '../models/asset'
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

export async function publish(formValues, marketContract, account, providers, price) {
    const { oceanAgent } = providers
    // First, register on the keeper (on-chain)
    await marketContract.requestTokens(2000, { from: account.name })

    const assetId = await marketContract.generateId(formValues.name + formValues.description)

    await marketContract.register(
        assetId,
        formValues.price, // price is zero for now.
        { from: account.name, gas: DEFAULT_GAS }
    )

    // Now register in oceandb and publish the metadata
    const newAsset = {
        assetId,
        metadata: Object.assign(AssetModel.metadata, {
            date: (new Date()).toString(),
            description: formValues.description,
            labels: formValues.tags ? [formValues.tags] : [],
            license: formValues.license,
            links: formValues.links ? [formValues.links] : [],
            name: formValues.name,
            updateFrequency: formValues.updateFrequency
        }),
        publisherId: account.name
    }
    await oceanAgent.publishDataAsset(newAsset)
}

export async function list(contract, account, providers) {
    const { oceanAgent } = providers
    var dbAssets = await oceanAgent.getAssetsMetadata()
    console.log('assets: ', dbAssets)

    dbAssets = Object.values(dbAssets).filter(async (asset) => { return contract.checkAsset(asset.assetId) })
    console.log('assets (published on-chain): ', dbAssets)

    return dbAssets
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
