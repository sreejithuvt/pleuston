import {
    Ocean
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

export async function provideOcean() {
    const nodeUri = `${keeperScheme}://${keeperHost}:${keeperPort}`
    const providerUri = `${oceanScheme}://${oceanHost}:${oceanPort}/api/v1/provider`

    const ocean = await new Ocean({
        web3Provider: global.web3 ? global.web3.currentProvider : null,
        nodeUri,
        network: keeperNetwork,
        providerUri
    })

    return { ocean }
}
