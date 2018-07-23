import TruffleContract from 'truffle-contract'

import Market from '@oceanprotocol/keeper-contracts/build/contracts/Market'
import { dbNamespace } from '../config'

const DEFAULT_GAS = 300 * 1000


export function getOceanBackendURL(providers) {
    const { web3, ocean_backend } = providers
    return ocean_backend.api_url + "/assets";
}

export async function deployContracts(provider) {
    const market = TruffleContract(Market)
    market.setProvider(provider)
    return {
        market: await market.deployed()
    }
}

export async function publish(asset, market_contract, account, providers) {
    const { web3, ocean_backend } = providers

    let assetId = ""

    // First, register on the keeper (on-chain)
    try {
        const id_str = asset.abstract
        assetId = await market_contract.generateStr2Id(id_str)

        await market_contract.register(
            assetId,
            asset.price, // price is zero for now.
            { from: account.name, gas: DEFAULT_GAS }
        )
    } catch (e) {
        console.error(e)
        return
    }

    // Now register in oceandb and publish the metadata
    let ocean_register_resource_url = getOceanBackendURL(providers) + "/asset"

    const dbAsset = await ocean_backend.models.ocean
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


    fetch(ocean_register_resource_url, {
        method: 'POST',
        body: JSON.stringify(asset),
        headers: {'Content-type': 'application/json'},
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));


    try {
        await market_contract.publish(
            assetId,
            web3.fromAscii(asset.url),
            web3.fromAscii(dbAsset.id),
            { from: account.name, gas: 300000 }
        )
    } catch (e) {
        console.error(e)
    }
}

export async function updateMetadata(asset, account, providers) {
    const { web3, ocean_backend } = providers

    // get provider-backend url
    let update_url = ocean_backend.api_url + "/assets/metadata";
    fetch(update_url, {
        method: 'PUT',
        body: JSON.stringify(asset),
        headers: {'Content-type': 'application/json'},
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));


}

export async function purchaseResource(asset, account, providers) {
    const { web3, db } = providers

    // TODO:
    // trigger purchaseResource on OceanAccessControl contract
    // listen to `resourcePurchaseAgreementPublished`
    // Once the purchase agreement is fetched, display to the user to get confirmation to proceed with purchase
    // When agreement accepted by consumer, pat the purchase price and continue with the purchase transaction
    // ...

}


export async function list(contract, account, providers, own_assets_only=false) {
    const { db } = providers

    let web3AssetIds = []
    try {
        web3AssetIds = (await contract.getListAssets())
            .filter(id => id > 0)
            .map(id => id.toString())
    } catch (e) {
        console.error(e)
    }

    let dbAssets = await db.models.ocean.retrieve(dbNamespace)
    if (own_assets_only && account) {
        const act_str = account.name
        dbAssets = dbAssets.filter(obj => obj.data.web3.account === act_str)
        console.log("num assets for current account: " + dbAssets.length + '>>>>  ' + act_str)
    }

    // console.log("num all assets: " + dbAssets.length + '>>>>  ' + act_str)

    return dbAssets.map(dbAsset => ({
        ...dbAsset.data.value,
        id: dbAsset.data.web3.id,
        publisher: dbAsset.data.web3.account,
        published: web3AssetIds.indexOf(dbAsset.data.web3.id) > -1,
        web3Id: dbAsset.data.web3.id,
        date: (new Date(dbAsset.data.value.date)).toLocaleDateString('en-US'),
        dbId: dbAsset.id
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
