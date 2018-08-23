import OceanAgent from '../drivers/ocean-agent'
import OceanKeeper from '../drivers/ocean-keeper'
// import Web3 from 'web3'
import {
    keeperHost,
    keeperPort,
    keeperScheme,
    oceanHost,
    oceanPort,
    oceanScheme
} from '../../config/ocean'

export async function createProviders() {
    const uri = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const oceanKeeper = new OceanKeeper(uri)
    const res = await oceanKeeper.initContracts()
    console.debug('contracts: ', res)
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

export async function getBalance(account, oceanKeeper, web3) {
    const eth = web3.eth.getBalance(account)

    let ocn = NaN
    try {
        ocn = await oceanKeeper.getBalance(account)
        console.log('ocn balance: ', ocn)
    } catch (e) {
        console.error('error in ocean getBalance: ', e)
    }

    return { eth, ocn }
}
