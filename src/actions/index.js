/* eslint-disable no-console */

import azure from 'azure-storage'
import * as account from './account'
import * as asset from './asset'
import Logger from '../logger'
import { cloudName, folderName, storageAccount, shareName, accessKey, sasToken } from '../../config/cloudStorage'

export function setProviders() {
    return async (dispatch) => {
        dispatch({
            type: 'SET_PROVIDERS',
            ...(await account.createProviders())
        })
    }
}

export function getAccounts() {
    return async (dispatch, getState) => {
        const { provider } = getState()
        dispatch({
            type: 'GET_ACCOUNTS',
            accounts: await account.list(provider)
        })
    }
}

export function setActiveAccount(accountId) {
    return (dispatch) => {
        dispatch({
            type: 'SET_ACTIVE_ACCOUNT',
            activeAccount: accountId
        })
    }
}

export function getActiveAccount(state) {
    let { activeAccount, accounts } = state.account
    if (accounts.length === 0) {
        return null
    }
    return accounts[activeAccount]
}

export function makeItRain(amount) {
    return async (dispatch, getState) => {
        const state = getState()

        try {
            await state.contract.market.requestTokens(
                amount,
                { from: getActiveAccount(state).name }
            )
            dispatch(getAccounts())
        } catch (e) {
            Logger.error(e)
        }
    }
}

export function putAsset(formValues) {
    return async (dispatch, getState) => {
        const state = getState()
        const account = getActiveAccount(state)

        await asset.publish(
            formValues,
            account,
            state.provider
        )

        dispatch(getAssets())
    }
}

export function getAssets() {
    /* Get list of assets for the current selected account */
    return async (dispatch, getState) => {
        const state = getState()

        const assets = (await asset
            .list(
                state.contract.market,
                getActiveAccount(state),
                state.provider
            ))
            .reduce((map, obj) => {
                map[obj.assetId] = obj
                return map
            }, {})

        dispatch({
            type: 'GET_ASSETS',
            assets
        })
    }
}

export function setActiveAsset(assetId) {
    return (dispatch) => {
        dispatch({
            type: 'SET_ACTIVE_ASSET',
            activeAsset: assetId
        })
    }
}

export function getActiveAsset(state) {
    const { activeAsset, assets } = state.asset

    if (!activeAsset && state.router.location.pathname) {
        const rgxAssetId = /\/datasets\/(.*?)/g
        const { pathname } = state.router.location
        if (rgxAssetId.exec(pathname)) {
            const assetIdFromUrl = pathname.replace(/^.*[\\\/]/, '') // eslint-disable-line
            if (assetIdFromUrl) {
                return assets[assetIdFromUrl]
            }
        }
    }

    return assets[activeAsset]
}

export function purchaseAsset(assetId) {
    return async (dispatch, getState) => {
        const state = getState()
        const activeAsset = getActiveAsset(state)
        const token = await asset.purchase(
            activeAsset,
            getActiveAccount(state),
            state.provider
        )

        dispatch({
            type: 'UPDATE_ASSET',
            assetId,
            asset: Object.assign(activeAsset, { token })
        })
    }
}

export function setAssetFilter(filter) {
    return (dispatch) => {
        dispatch({
            type: 'SET_ASSET_FILTER',
            filter
        })
    }
}

export function getActiveOrder(state) {
    const { activeOrder, orders } = state.order

    if (activeOrder) {
        return orders[activeOrder]
    }

    return {}
}

export function setActiveOrder(orderId) {
    return (dispatch) => {
        dispatch({
            type: 'SET_ACTIVE_ORDER',
            activeOrder: orderId
        })
    }
}

export function getOrders() {
    return async (dispatch, getState) => {
        const state = getState()
        const account = getActiveAccount(state)
        if (!account) {
            Logger.log('active account is not set.')
            return []
        }

        let { oceanKeeper } = state.provider
        let orders = await oceanKeeper.getConsumerOrders(account.name)
        Logger.log('ORDERS: ', orders, Object.values(state.asset.assets))
        let assets = null
        if (Object.values(state.asset.assets).length !== 0) {
            assets = Object.values(state.asset.assets).reduce((map, obj) => {
                map[obj.assetId] = obj
                return map
            })
        }
        if (assets !== null && Object.values(assets).length !== 0) {
            for (let order of orders) {
                if (order._resourceId && assets[order._resourceId]) {
                    order.assetName = assets[order._resourceId].metadata.name
                }
            }
        }
        // map orders by order id
        orders = orders.reduce((map, obj) => {
            map[obj._id] = obj
            return map
        }, {})
        Logger.log('ORDERS mapped: ', orders)

        dispatch({
            type: 'GET_ORDERS',
            orders
        })
    }
}

export function getCloudFiles() {
    /* Get list of files in cloud storage if cloud access is defined in the config file */
    return async (dispatch) => {
        if (cloudName === 'azure') {
            const fileService = azure.createFileService(storageAccount, accessKey)
            fileService.listFilesAndDirectoriesSegmented(shareName, folderName, null, null, (error, results, response) => {
                if (!error) {
                    let cloudFiles = []
                    // Just process files,ignoring directories for now
                    for (let file of results.entries.files) {
                        // Deal with file object
                        cloudFiles.push({ shareName, folderName, fileName: file.name })
                    }

                    console.log('files from azure storage: ', cloudFiles)
                    dispatch({
                        type: 'CLOUD_FILES',
                        files: cloudFiles
                    })
                } else {
                    console.error('error listing files in azure storage.', error)
                }
            })
        }
    }
}

export function pickFileFromStorage() {
    function getUserPickedFileFromList(filesList) {
        // TODO: prompt user to pick one of the files in the list
        return filesList[0].fileName
    }

    return (dispatch, getState) => {
        const state = getState()
        console.log('get azure blob url', state.cloudStorage.files, storageAccount, accessKey, sasToken)
        const fileService = azure.createFileService(storageAccount, accessKey)
        console.log('time: ', (new Date().getTime()))
        const timeout = (new Date().getTime()) + 3600 * 24 * 30 // 12 hours
        const sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.FileUtilities.SharedAccessPermissions.READ,
                Expiry: timeout
            }
        }

        const fileName = getUserPickedFileFromList(state.cloudStorage.files)
        const token = fileService.generateSharedAccessSignature(shareName, folderName, fileName, sharedAccessPolicy)
        const sasUrl = fileService.getUrl(shareName, folderName, fileName, token)
        console.log(shareName, folderName, fileName, token)
        dispatch({ type: 'GET_URL', url: sasUrl })
    }
}
