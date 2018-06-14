import TruffleContract from 'truffle-contract'

import { dbNamespace } from '../config'
import Market from '../contracts/Market'


export async function deployContracts(provider) {
    const market = TruffleContract(Market)
    market.setProvider(provider)
    return {
        market: await market.deployed()
    }
}

export async function publish(asset, contract, account, web3, db) {
    const assetId = await contract.getListAssetsSize()

    await contract.register(
        assetId,
        { from: account.name, gas: 300000 }
    )

    const dbAsset = await db.models.ocean
        .create({
            keypair: account.db,
            data: {
                web3: {
                    account: account.name,
                    id: assetId
                },
                value: asset
            }
        })

    await contract.publish(
        assetId,
        web3.fromAscii(asset.url),
        web3.fromAscii(dbAsset.id),
        { from: account.name }
    )
}

export async function list(contract, account, web3, db) {
    const dbAssets = await db.models.ocean.retrieve(dbNamespace)

    const web3AssetIds = (await contract.getListAssets())
        .filter(id => id > 0)
        .map(id => id.toString())

    return dbAssets.map(dbAsset => ({
        id: dbAsset.id,
        web3Id: dbAsset.data.web3.id,
        publisher: dbAsset.data.web3.account,
        published: web3AssetIds.indexOf(dbAsset.data.web3.id) > -1,
        ...dbAsset.data.value
    }))
}

export async function purchase(assetId, contract, account, web3, db) {

    await contract.purchase(
        assetId,
        { from: account.name, gas: 200000 }
    )

    const url = web3.toAscii(await contract.getAssetUrl(assetId))
    const token = web3.toAscii(await contract.getAssetToken(assetId))

    const dbAssetRetrieved = await db.models.ocean.retrieve(token)[0]

    return { url, token }
}
