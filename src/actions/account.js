import {
    OceanKeeper,
    OceanAgent
} from '@oceanprotocol/keeper-js'

import {
    keeperHost,
    keeperPort,
    keeperScheme,
    keeperNetwork,
    oceanHost,
    oceanPort,
    oceanScheme
} from '../../config/ocean'

export async function createProviders() {
    const web3URI = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const web3Provider = new Web3.providers.HttpProvider(web3URI)
    const web3 = global.web3 || new Web3(web3Provider)
    const uri = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const oceanKeeper = new OceanKeeper(uri, 'development')
    await oceanKeeper.initContracts()
    const { web3 } = oceanKeeper
    const providerURL = `${oceanScheme}://${oceanHost}:${oceanPort}/api/v1/provider`
    const oceanAgent = new OceanAgent(providerURL)

    return { web3, oceanKeeper, oceanAgent }
}

export async function list(providers) {
    const { web3, oceanKeeper } = providers

    return Promise.all(web3.eth.accounts.map(async (account) => {
        oceanKeeper.requestTokens(account, 1000)
        const balance = await getBalance(account, oceanKeeper, web3)

        return {
            name: account,
            balance
        }
    }))
}

function getEthBalance(web3, account) {
    return new Promise((resolve, reject) => {
        console.log('getting balance for', account)
        web3.eth.getBalance(account, 'latest', (err, balance) => {
            if (err) return reject(err)
            console.log('balance', balance)
            resolve(balance)
        })
    })
}

export async function getBalance(account, oceanKeeper, providers) {
    const { web3 } = providers

    let eth = NaN
export async function getBalance(account, oceanKeeper, web3) {
    const eth = web3.eth.getBalance(account)

    let ocn = NaN
    try {
        ocn = await oceanKeeper.getBalance(account)
        eth = await getEthBalance(web3, account)
    } catch (e) {
        console.error('error in ocean getBalance: ', e)
    }

    return { eth, ocn }
}
