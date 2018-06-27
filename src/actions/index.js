import * as account from './account' // eslint-disable-line
import * as asset from './asset' // eslint-disable-line


import mockAssets from '../mock/assets'


export function setProviders() {
    return (dispatch) => {
        dispatch({
            type: 'SET_PROVIDERS',
            ...account.createProviders()
        })
    }
}

export function getAccounts() {
    return async (dispatch, getState) => {
        const {
            provider,
            contract: {
                ocean
            }
        } = getState()

        dispatch({
            type: 'GET_ACCOUNTS',
            accounts: await account.list(ocean, provider)
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
    const { activeAccount, accounts } = state.account
    return accounts[activeAccount]
}

export function setContracts() {
    return async (dispatch, getState) => {
        const { currentProvider } = getState().provider.web3
        try {
            dispatch({
                type: 'SET_CONTRACTS',
                contracts: {
                    ...(await account.deployContracts(currentProvider)),
                    ...(await asset.deployContracts(currentProvider))
                }
            })
        } catch (e) {
            console.error(e)
        }
    }
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
            console.error(e)
        }
    }
}

export function putAsset(newAsset) {
    return async (dispatch, getState) => {
        const state = getState()

        await asset.publish(
            Object.assign(mockAssets[0], newAsset),
            state.contract.market,
            getActiveAccount(state),
            state.provider
        )

        dispatch(getAssets())
    }
}


export function getAssets() {
    return async (dispatch, getState) => {
        const state = getState()

        const assets = (await asset
            .list(
                state.contract.market,
                getActiveAccount(state),
                state.provider
            ))
            .reduce((map, obj) => {
                map[obj.id] = obj
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

        const token = await asset.purchase(
            getActiveAsset(state).web3Id,
            state.contract.market,
            getActiveAccount(state),
            state.provider
        )

        dispatch({
            type: 'UPDATE_ASSET',
            assetId,
            asset: Object.assign(getActiveAsset(state), { token })
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
