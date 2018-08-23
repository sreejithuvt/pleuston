import * as account from './account'
import * as asset from './asset'
import * as order from './order'

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
            console.error(e)
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
            state.contract,
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
            console.log('active account is not set.')
            return []
        }

        let { acl } = state.contract

        let accessConsentEvent = acl.AccessConsentRequested({ _consumer: account.name }, {
            fromBlock: 0,
            toBlock: 'latest'
        })

        let _resolve = null
        let _reject = null
        const promise = new Promise((resolve, reject) => {
            _resolve = resolve
            _reject = reject
        })

        const getEvents = () => {
            accessConsentEvent.get((error, logs) => {
                if (error) {
                    _reject(error)
                    throw new Error(error)
                } else {
                    _resolve(logs)
                }
            })
            return promise
        }
        const events = await getEvents().then((events) => events)
        let orders = await order.buildOrdersFromEvents(events, state.contract, account).then((result) => result)
        console.log('ORDERS: ', orders, Object.values(state.asset.assets))
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
        orders = orders.reduce((map, obj) => {
            map[obj._id] = obj
            return map
        }, {})
        console.log('ORDERS mapped: ', orders)

        dispatch({
            type: 'GET_ORDERS',
            orders
        })
    }
}
