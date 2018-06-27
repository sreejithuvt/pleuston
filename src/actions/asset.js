import TruffleContract from 'truffle-contract'

import Market from '@oceanprotocol/keeper-contracts/build/contracts/Market'
import { dbNamespace } from '../config'


export async function deployContracts(provider) {
    const market = TruffleContract(Market)
    market.setProvider(provider)
    return {
        market: await market.deployed()
    }
}

export async function publish(asset, contract, account, providers) {
    const { web3, db } = providers

    let assetId = -1

    try {
        assetId = await contract.getListAssetsSize()

        await contract.register(
            assetId,
            { from: account.name, gas: 300000 }
        )
    } catch (e) {
        console.error(e)
    }

    const dbAsset = await db.models.ocean
        .create({
            keypair: account.db,
            data: {
                web3: {
                    account: account.name,
                    id: assetId
                },
                value: {
                    ...asset,
                    date: Math.round((new Date()).getTime())
                }
            }
        })

    try {
        await contract.publish(
            assetId,
            web3.fromAscii(asset.url),
            web3.fromAscii(dbAsset.id),
            { from: account.name, gas: 300000 }
        )
    } catch (e) {
        console.error(e)
    }
}

export async function list(contract, account, providers) {
    const { db } = providers

    let web3AssetIds = []
    try {
        web3AssetIds = (await contract.getListAssets())
            .filter(id => id > 0)
            .map(id => id.toString())
    } catch (e) {
        console.error(e)
    }

    const dbAssets = await db.models.ocean.retrieve(dbNamespace)

    return dbAssets.map(dbAsset => ({
        ...dbAsset.data.value,
        id: dbAsset.id,
        publisher: dbAsset.data.web3.account,
        published: web3AssetIds.indexOf(dbAsset.data.web3.id) > -1,
        web3Id: dbAsset.data.web3.id,
        date: (new Date(dbAsset.data.value.date)).toLocaleDateString('en-US')
    }))
}

export async function purchase(assetId, contract, account, providers) {
    const { web3 } = providers

    await contract.purchase(
        assetId,
        { from: account.name, gas: 200000 }
    )

    const token = web3.toAscii(await contract.getAssetToken(assetId))

    // const dbAssetRetrieved = await db.models.ocean.retrieve(token)[0]
    return token
}
