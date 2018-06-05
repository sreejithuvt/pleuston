import React from 'react'
import TruffleContract from 'truffle-contract'
import Web3Component from './Web3Component'

import OceanToken from '../contracts/OceanToken'


class TokenContract extends Web3Component {
    constructor(props) {
        super(props)
        const { accounts } = this.web3.eth

        const contract = TruffleContract(OceanToken)
        contract.setProvider(this.web3Provider)

        this.state = {
            account: accounts[0],
            balance: null,
            contract
        }
    }

    componentDidMount = async () => {
        const {
            account,
        } = this.state

        const balance = await this.getTokenBalance(account)

        // Watch for change
        this.web3.eth.filter('latest').watch(() => {
            this.getTokenBalance(account).then((newBalance) => this.setState({ balance: newBalance }))
        })

        this.setState({ loading: false, balance })
    }

    getTokenBalance = async (account) => {
        const {
            contract
        } = this.state

        const balance = await contract.deployed().then(instance => instance.balanceOf(account))
        return balance.toString()
    }

    render() {
        const {
            loading,
            account,
            balance
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        // Done
        return (
            <div>
                <div>{ account }</div>
                <div>{ balance }</div>

            </div>
        )
    }
}

export default TokenContract
