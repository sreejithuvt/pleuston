import {
    Ocean,
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

export async function createProviders() {
    const uri = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const ocean = await new Ocean({
        web3Provider: global.web3 ? global.web3.currentProvider : null,
        uri,
        network: keeperNetwork
    })

    const providerURL = `${oceanScheme}://${oceanHost}:${oceanPort}/api/v1/provider`
    const oceanAgent = new OceanAgent(providerURL)

    return { ocean, oceanAgent }
}

export async function list(providers) {
    const { ocean } = providers
    return ocean.getAccounts()
}
