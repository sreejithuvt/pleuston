import React from 'react'
import TruffleContract from 'truffle-contract'
import Web3Component from './Web3Component'

import Market from '../contracts/Market.json'


class MarketContract extends Web3Component {
    constructor(props) {
        super(props)
        const { accounts } = this.web3.eth

        const contract = TruffleContract(Market)
        contract.setProvider(this.web3Provider)

        this.state = {
            account: accounts[0],
            contract
        }
    }

    rain = async (amount) => {
        const {
            account,
            contract
        } = this.state

        const market = await contract.deployed()
        await market.requestTokens(amount, { from: account })
    }

    render() {
        const {
            loading
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        // Done
        return (
            <div>
                <div className="button-primary" onClick={() => this.rain(1000)}>rain</div>
            </div>
        )
    }
}

export default MarketContract
