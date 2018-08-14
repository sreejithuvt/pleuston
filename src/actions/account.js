import Web3 from 'web3'
import OceanAgent from '../lib/oceanagent'
import bip39 from 'bip39'
import TruffleContract from 'truffle-contract'

import OceanToken from '@oceanprotocol/keeper-contracts/build/contracts/OceanToken'

import {
    keeperHost,
    keeperPort,
    keeperScheme,
    oceanHost,
    oceanPort,
    oceanScheme
} from '../config'

export function createProviders() {
    const web3URI = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const web3Provider = new Web3.providers.HttpProvider(web3URI)
    const web3 = new Web3(web3Provider)

    // ocean agent
    const ocnURL = `${oceanScheme}://${oceanHost}:${oceanPort}/api/v1/provider`
    const oceanAgent = new OceanAgent(ocnURL)
    return { web3, oceanAgent }
}

export async function deployContracts(provider) {
    const oceanToken = TruffleContract(OceanToken)
    oceanToken.setProvider(provider)
    return {
        oceanToken: await oceanToken.deployed()
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
