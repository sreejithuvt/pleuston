import React from 'react'
import TruffleContract from 'truffle-contract'

import Account from './Account'
import Web3Component from './Web3Component'

import OceanToken from '../contracts/OceanToken'


class TokenContract extends Web3Component {
    constructor(props) {
        super(props)

        const contract = TruffleContract(OceanToken)
        contract.setProvider(this.web3Provider)

        this.state = {
            balance: null,
            contract
        }
    }

    componentDidMount = async () => {
        const {
            account,
        } = this.props

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

        const balance = await contract.deployed().then(instance => instance.balanceOf(account.name))
        return balance.toString()
    }

    render() {
        const { account } = this.props

        const {
            loading,
            balance
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        // Done
        return (
            <Account
                balance={balance}
                name={account.name}
                onClick={console.log('click')} />
        )
    }
}

export default TokenContract
