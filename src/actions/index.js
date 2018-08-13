import * as account from './account'
import * as asset from './asset'
import * as order from './order'

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
                oceanToken
            }
        } = getState()

        dispatch({
            type: 'GET_ACCOUNTS',
            accounts: await account.list(oceanToken, provider)
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

export function updateAsset(updatedAsset) {
    return async (dispatch, getState) => {
        getState()

        await asset.updateMetadata(
            Object.assign(mockAssets[0], updatedAsset)
            // ... TODO
        )

        dispatch(getAssets())
    }
}

export function getAssets() {
    /* Get list of assets for the current selected account */
    return async (dispatch, getState) => {
        const state = getState()
        console.log('market: ', state.contract.market)
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
            getActiveAsset(state),
            state.contract,
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
        const orders = (await order
            .list(
                state.contract,
                getActiveAccount(state),
                state.provider
            ))
            .reduce((map, obj) => {
                map[obj.id] = obj
                return map
            }, {})

        dispatch({
            type: 'GET_ORDERS',
            orders
        })
    }
}

export function processKeeperEvents() {
    // Depends on getOrders so orders are already set in the store
    return async (dispatch, getState) => {
        const state = getState()
        let { orders } = state.order

        // for each order:
        // if delivered, revoked, or expired (unpaid, committed or not) -> skip
        // else -> listen to event that matches the current status:
        //    if committed && not paid -> listen to committed event
        //    elif committed && paid -> listen to token published event

        const account = getActiveAccount(state)
        const curTime = new Date().getTime()
        Object.values(orders).forEach(o => {
            if (o.status === 3 || o.status === 2 || (curTime > o.timeout && !o.paid)) {
                console.log('Skip order not needing action: ', o.id, o.assetId, o.status)
            } else if (o.status === 0) {
                console.log('Uncommitted order, process commitment event: ', o.id, o.assetId)
                order.watchAccessRequestCommitted(o, state.contract, account.name, state.provider)
                // watchAccessRequestRejected(o, state.contract, account.name)
            } else if (o.paid) { // status must be 1, i.e. COMMITTED
                console.log('Order committed and paid, process published jwt event: ', o.id, o.assetId)
                order.watchPaymentReceived(o, state.contract, account.name, state.provider)
                // watchEncryptedTokenPublished(o, state.contract, account.name, state.provider)
            }
        })
    }
}
