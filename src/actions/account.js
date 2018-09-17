import {
    Ocean,
    OceanAgent,
    Logger
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

export async function createProviders() {
    const uri = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const ocean = await new Ocean({
        web3Provider: global.web3 ? global.web3.currentProvider : null,
        uri,
        network: keeperNetwork
    }).getInstance()

    Logger.log(1, ocean)

    const providerURL = `${oceanScheme}://${oceanHost}:${oceanPort}/api/v1/provider`
    const oceanAgent = new OceanAgent(providerURL)

    return { ocean, oceanAgent }
}

export async function list(providers) {
    const { ocean } = providers

    // todo, move this to squid
    Logger.log(2, ocean)

    return Promise.all(ocean.helper.getAccounts().map(async (account) => {
        ocean.market.requestTokens(account, 1000)
        const balance = await getBalance(account, ocean)

        return {
            name: account,
            balance
        }
    }))
}

export async function getBalance(account, ocean) {
    let eth = NaN
    let ocn = NaN

    try {
        ocn = await ocean.token.getBalance(account)
        eth = await ocean.token.getEthBalance(account)
    } catch (e) {
        Logger.error('error in ocean getBalance: ', e)
    }

    return { eth, ocn }
}
