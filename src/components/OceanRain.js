import React from 'react'
import TruffleContract from 'truffle-contract'

import Button from '../components/Button'
import Web3Component from './Web3Component'

import Market from '../contracts/Market'

import './OceanRain.css'

class OceanRain extends Web3Component {
    constructor(props) {
        super(props)

        const contract = TruffleContract(Market)
        contract.setProvider(this.web3Provider)

        this.state = {
            contract
        }
    }

    rain = async (amount) => {
        const {
            contract
        } = this.state

        const market = await contract.deployed()
        await market.requestTokens(amount, { from: this.props.account.name })
    }

    render() {
        const {
            loading
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        // Done
        return (
            <div className="ocean-rain">
                <Button
                    className="button ocean-rain__button"
                    onClick={() => this.rain(10)}>
                    Make it rain
                </Button>
            </div>
        )
    }
}

export default OceanRain
