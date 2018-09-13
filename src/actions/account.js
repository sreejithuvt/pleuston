import {
    OceanKeeper,
    OceanAgent
} from '@oceanprotocol/squid'

import {
    keeperHost,
    keeperPort,
    keeperScheme,
    keeperNetwork,
    oceanHost,
    oceanPort,
    oceanScheme
} from '../../config/ocean'
import Logger from '../logger'

export async function createProviders() {
    const uri = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const oceanKeeper = new OceanKeeper(uri, keeperNetwork)
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
        Logger.log('getting balance for', account)
        web3.eth.getBalance(account, 'latest', (err, balance) => {
            if (err) return reject(err)
            Logger.log('balance', balance)
            resolve(balance)
        })
    })
}

export async function getBalance(account, oceanKeeper) {
    let eth = NaN
    let ocn = NaN

    try {
        ocn = await oceanKeeper.getBalance(account)
        eth = await getEthBalance(oceanKeeper.web3, account)
    } catch (e) {
        Logger.error('error in ocean getBalance: ', e)
    }

    return { eth, ocn }
}
