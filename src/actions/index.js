import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Market from '../contracts/Market'

import config from '../config'
import mockAssets from '../mock/assets'


export function setProviderWeb3() {
    return (dispatch) => {
        const web3Provider = new Web3.providers.HttpProvider(`http://${config.keeperHost}:${config.keeperPort}`)
        dispatch({
            type: 'SET_PROVIDER_WEB3',
            web3: new Web3(web3Provider),
            web3Provider
        })
    }
}

export function setContractMarket() {
    return async (dispatch, getState) => {
        const contract = TruffleContract(Market)
        const { web3Provider } = getState().provider
        contract.setProvider(web3Provider)
        dispatch({
            type: 'SET_CONTRACT_MARKET',
            market: await contract.deployed()
        })
    }
}

export function getAccounts() {
    return async (dispatch, getState) => {
        const { web3 } = getState().provider
        const accounts = await web3.eth.accounts.map((account) => (
            {
                name: account,
                balance: (web3.eth.getBalance(account) / 1e18).toFixed(2).toString(),
            }))

        dispatch({
            type: 'GET_ACCOUNTS',
            accounts
        })
    }
}

export function setActiveAccount(account) {
    return (dispatch) => {
        dispatch({
            type: 'SET_ACTIVE_ACCOUNT',
            activeAccount: account
        })
    }
}

export function getAssets() {
    return async (dispatch, getState) => {
        const { market } = getState().contract
        const assetListMarket = await market.getListAssets()

        const assets = mockAssets.map((asset, index) => {
            asset.id = assetListMarket[index].toString()
            return asset
        })

        dispatch({
            type: 'GET_ASSETS',
            assets
        })
    }
}