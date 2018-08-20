import TruffleContract from 'truffle-contract'
import fetchDownload from '../lib/fetch-download'
import AssetModel from '../models/asset'
import PurchaseHandler from './purchase'
import {keeperNetwork} from '../config'
import ContractLoader from './contractLoader'

const DEFAULT_GAS = 1000 * 1000

export async function deployContracts(provider) {
    const OceanMarket = ContractLoader.load("OceanMarket", keeperNetwork)
    const market = TruffleContract(OceanMarket)
    const OceanAuth = ContractLoader.load("OceanAuth", keeperNetwork)
    const acl = TruffleContract(OceanAuth)

    market.setProvider(provider)
    acl.setProvider(provider)

    return {
        market: await market.at(OceanMarket.address),
        acl: await acl.at(OceanAuth.address)
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
            links: formValues.links,
            name: formValues.name,
            updateFrequency: formValues.updateFrequency
        }),
        publisherId: account.name
    }
    await oceanAgent.publishDataAsset(newAsset)
}

export async function list(contract, account, providers) {
    const { oceanAgent } = providers
    let dbAssets = await oceanAgent.getAssetsMetadata()
    console.log('assets: ', dbAssets)

    dbAssets = Object.values(dbAssets).filter(async (asset) => { return contract.checkAsset(asset.assetId) })
    console.log('assets (published on-chain): ', dbAssets)

    return dbAssets
}

export async function purchase(asset, contracts, account, providers) {
    const { web3 } = providers

    console.log('Purchasing asset by consumer:  ', account.name, ' assetid: ', asset.assetId)

    let purchaseHandler = new PurchaseHandler(asset, null, contracts, account, web3)
    let order = await purchaseHandler.doPurchase()
    if (order.accessUrl) {
        console.log('begin downloading asset data.')
        await fetchDownload(order.accessUrl)
            .then((result) => console.log('Asset data downloaded successfully: ', result))
            .catch((error) => console.log('Asset download failed: ', error))
    }
    console.log('purchase completed, new order is: ', order)
}
