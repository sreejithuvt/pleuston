import Web3 from 'web3'
import Orm from 'bigchaindb-orm'
import bip39 from 'bip39'

import * as asset from './asset' // eslint-disable-line


import {
    dbHeaders,
    dbHost,
    dbNamespace,
    dbPort,
    dbScheme,
    keeperHost,
    keeperPort,
    keeperScheme,
} from '../config'

import mockAssets from '../mock/assets'


export function setProviders() {
    return (dispatch) => {
        // web3
        const web3URI = `${keeperScheme}://${keeperHost}:${keeperPort}`
        const web3Provider = new Web3.providers.HttpProvider(web3URI)

        const web3 = new Web3(web3Provider)

        // bdb
        const bdbURI = `${dbScheme}://${dbHost}:${dbPort}/api/v1/`
        const headers = dbHeaders

        const db = new Orm(
            bdbURI,
            headers
        )
        db.define('ocean', dbNamespace)

        dispatch({
            type: 'SET_PROVIDERS',
            web3,
            db
        })
    }
}

export function getAccounts() {
    return async (dispatch, getState) => {
        const {
            web3,
            db
        } = getState().provider

        const accounts = await web3.eth.accounts.map((account) => {
            const secret = account // bip39.generateMnemonic()
            const seed = bip39.mnemonicToSeed(secret).slice(0, 32)

            const balance = web3.eth.getBalance(account)

            return {
                name: account,
                balance: (balance / 1e18).toFixed(2).toString(),
                db: new db.driver.Ed25519Keypair(seed)
            }
        })

        dispatch({
            type: 'GET_ACCOUNTS',
            accounts
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
        const { web3 } = getState().provider

        const contracts = await asset.deployContracts(web3.currentProvider)

        dispatch({
            type: 'SET_CONTRACTS',
            contracts
        })
    }
}

export function makeItRain(amount) {
    return async (dispatch, getState) => {
        const state = getState()

        await state.contract.market.requestTokens(
            amount,
            { from: getActiveAccount(state).name }
        )
    }
}

export function putAsset(newAsset) {
    return async (dispatch, getState) => {
        const state = getState()

        await asset.publish(
            Object.assign(mockAssets[0], newAsset),
            state.contract.market,
            getActiveAccount(state),
            state.provider.web3,
            state.provider.db
        )

        dispatch(getAssets())
    }
}


export function getAssets() {
    return async (dispatch, getState) => {
        const state = getState()

        const assets = await asset.list(
            state.contract.market,
            getActiveAccount(state),
            state.provider.web3,
            state.provider.db
        )

        dispatch({
            type: 'GET_ASSETS',
            assets: assets.reduce((map, obj) => {
                map[obj.id] = obj
                return map
            }, {})
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
            const assetIdFromUrl = pathname.replace(/^.*[\\\/]/, '')
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
            state.provider.web3,
            state.provider.db
        )

        dispatch({
            type: 'UPDATE_ASSET',
            assetId,
            asset: Object.assign(getActiveAsset(state), { token })
        })
    }
}
