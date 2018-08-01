import Web3 from 'web3'
import Orm from 'bigchaindb-orm'
import bip39 from 'bip39'
import TruffleContract from 'truffle-contract'

import OceanToken from '@oceanprotocol/keeper-contracts/build/contracts/OceanToken'

import {
    dbHeaders,
    dbHost,
    dbNamespace,
    dbPort,
    dbScheme,
    keeperHost,
    keeperPort,
    keeperScheme,
    ocnHost,
    ocnPort,
    ocnScheme
} from '../config'

export function createProviders() {
    const web3URI = `${keeperScheme}://${keeperHost}:${keeperPort}`

    const web3Provider = new Web3.providers.HttpProvider(web3URI)
    const web3 = new Web3(web3Provider)

    // bdb
    const bdbURI = `${dbScheme}://${dbHost}:${dbPort}/api/v1/`
    const headers = dbHeaders

    const db = new Orm(
        bdbURI,
        headers
    )
    db.define('ocean', dbNamespace)

    // ocean agent
    const ocnURL = `${ocnScheme}://${ocnHost}:${ocnPort}/api/v1/provider`
    return { web3, db, ocnURL }
}

export async function deployContracts(provider) {
    const oceanToken = TruffleContract(OceanToken)
    oceanToken.setProvider(provider)
    return {
        oceanToken: await oceanToken.deployed()
    }
}

export async function list(contract, providers) {
    const { web3, db } = providers

    return Promise.all(web3.eth.accounts.map(async (account) => {
        const secret = account // bip39.generateMnemonic()
        const seed = bip39.mnemonicToSeed(secret).slice(0, 32)

        const balance = await getBalance(account, contract, providers)

        return {
            name: account,
            balance,
            db: new db.driver.Ed25519Keypair(seed)
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
