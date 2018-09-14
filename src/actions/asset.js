import fetchDownload from 'fetch-download'
import AssetModel from '../models/asset'
import PurchaseHandler from './purchase'
import Logger from '../logger'

const MINIMUM_REQUIRED_TOKENS = 10

export async function publish(formValues, account, providers) {
    const { oceanKeeper, oceanAgent } = providers
    const publisherId = account.name

    // check account balance and request tokens if necessary
    const tokensBalance = await oceanKeeper.getBalance(publisherId)
    if (tokensBalance < MINIMUM_REQUIRED_TOKENS) {
        oceanKeeper.requestTokens(publisherId, MINIMUM_REQUIRED_TOKENS)
    }

    // Get user entered form values
    const {
        name,
        description,
        license,
        contentUrls,
        author,
        copyrightHolder,
        tags,
        price,
        updateFrequency
    } = formValues

    // Register on the keeper (on-chain) first, then on the OceanDB
    const assetId = await oceanKeeper.registerDataAsset(
        name, description, price, publisherId
    )

    // Now register in oceandb and publish the metadata
    const newAsset = {
        assetId,
        publisherId,

        // OEP-08 Attributes
        // https://github.com/oceanprotocol/OEPs/tree/master/8
        base: Object.assign(AssetModel.base, {
            name,
            description,
            dateCreated: (new Date()).toString(),
            // size: ,
            author,
            license,
            copyrightHolder,
            // encoding: ,
            // compression: ,
            // contentType: ,
            // workExample: ,
            contentUrls: [contentUrls],
            // links: ,
            // inLanguage: ,
            tags: tags ? [tags.split(',')] : [],
            price
        }),
        // curation: Object.assign(AssetModel.curation, {
        //     rating: ,
        //     numVotes: ,
        //     schema:
        // }),
        additionalInformation: Object.assign(AssetModel.additionalInformation, {
            updateFrequency
        })
    }
    const res = await oceanAgent.publishDataAsset(newAsset)
    Logger.debug('res: ', res)
    return newAsset
}

export async function list(contract, account, providers) {
    const { oceanKeeper, oceanAgent } = providers
    let dbAssets = await oceanAgent.getAssetsMetadata()
    Logger.log('assets: ', dbAssets)

    dbAssets = Object.values(dbAssets).filter(async (asset) => { return oceanKeeper.checkAsset(asset.assetId) })
    Logger.log('assets (published on-chain): ', dbAssets)

    return dbAssets
}

export async function purchase(asset, account, providers) {
    const { oceanKeeper } = providers

    Logger.log('Purchasing asset by consumer:  ', account.name, ' assetid: ', asset.assetId)

    let purchaseHandler = new PurchaseHandler(asset, account, oceanKeeper)
    let order = await purchaseHandler.doPurchase()
    if (order.accessUrl) {
        Logger.log('begin downloading asset data.')
        const res = await fetchDownload(order.accessUrl)
            .then((result) => Logger.log('Asset data downloaded successfully: ', result))
            .catch((error) => Logger.log('Asset download failed: ', error))
        Logger.debug('res: ', res)
    }
    Logger.log('purchase completed, new order is: ', order)
}
