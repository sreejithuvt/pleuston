import fetchDownload from 'fetch-download'
import AssetModel from '../models/asset'
import PurchaseHandler from './purchase'

const MINIMUM_REQUIRED_TOKENS = 10

export async function publish(formValues, account, providers) {
    const { oceanKeeper, oceanAgent } = providers
    // check account balance and request tokens if necessary
    const tokensBalance = await oceanKeeper.getBalance(account.name)
    if (tokensBalance < MINIMUM_REQUIRED_TOKENS) {
        oceanKeeper.requestTokens(account.name, MINIMUM_REQUIRED_TOKENS)
    }
    // Register on the keeper (on-chain) first, then on the OceanDB
    const assetId = await oceanKeeper.registerDataAsset(
        formValues.name, formValues.description, formValues.price, account.name
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
    const res = await oceanAgent.publishDataAsset(newAsset)
    console.debug('res: ', res)
    return newAsset
}

export async function list(contract, account, providers) {
    const { oceanKeeper, oceanAgent } = providers
    let dbAssets = await oceanAgent.getAssetsMetadata()
    console.log('assets: ', dbAssets)

    dbAssets = Object.values(dbAssets).filter(async (asset) => { return oceanKeeper.checkAsset(asset.assetId) })
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
        const res = await fetchDownload(order.accessUrl)
            .then((result) => console.log('Asset data downloaded successfully: ', result))
            .catch((error) => console.log('Asset download failed: ', error))
        console.debug('res: ', res)
    }
    console.log('purchase completed, new order is: ', order)
}
