import Web3 from 'web3'
import config from '../config'


export function getAccounts() {
    return async dispatch => {
        const web3Provider = new Web3.providers.HttpProvider(`http://${config.keeperHost}:${config.keeperPort}`)
        const web3 = new Web3(web3Provider)
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
