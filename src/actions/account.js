import Web3 from 'web3'
import OceanAgent from '../drivers/ocean-agent'
import TruffleContract from 'truffle-contract'
import ContractLoader from './contractLoader'

import {
    keeperHost,
    keeperPort,
    keeperScheme,
    keeperNetwork,
    oceanHost,
    oceanPort,
    oceanScheme
} from '../config'

export function createProviders() {

    const web3URI = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const web3Provider = new Web3.providers.HttpProvider(web3URI)
    const web3 = web3 ? web3.currentProvider : new Web3(web3Provider)

    // ocean agent
    const ocnURL = `${oceanScheme}://${oceanHost}:${oceanPort}/api/v1/provider`
    const oceanAgent = new OceanAgent(ocnURL)
    return { web3, oceanAgent }
}

export async function deployContracts(provider) {
    const OceanToken = ContractLoader.load("OceanToken", keeperNetwork)
    const oceanToken = TruffleContract(OceanToken)
    oceanToken.setProvider(provider)
    return {
        oceanToken: await oceanToken.at(OceanToken.address)
    }
}

export async function list(contract, providers) {
    const { web3 } = providers

    return Promise.all(web3.eth.accounts.map(async (account) => {
        const balance = await getBalance(account, contract, providers)

        return {
            name: account,
            balance
        }
    }))
}

export async function getBalance(account, contract, providers) {
    const { web3 } = providers

    const eth = web3.eth.getBalance(account)

    let ocn = NaN
    try {
        ocn = await contract.balanceOf.call(account)
    } catch (e) {
        console.error(e)
    }

    return { eth, ocn }
}
