import React from 'react'

import AccountList from './AccountList'
import MarketContract from './MarketContract'
import TokenContract from './TokenContract'
import Web3Component from './Web3Component'


class Wallet extends Web3Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            activeAccount: 0,
            accounts: this.web3.eth.accounts.map((name) => (
                {
                    name,
                    balance: null,
                    decimals: 1e18
                }
            )),
        }
    }

    componentDidMount = async () => {
        this.setState({ accounts: this.getBalancesForAccounts() })
        // Watch for change
        this.web3.eth.filter('latest').watch(() => {
            this.setState({ accounts: this.getBalancesForAccounts() })
        })

        this.setState({ loading: false })
    }

    getBalancesForAccounts = () => {
        const {
            accounts,
        } = this.state


        return accounts.map((account) => (
            {
                name: account.name,
                balance: (this.web3.eth.getBalance(account.name) / 1e18).toFixed(2).toString(),
            }
        ))
    }

    render() {
        const {
            loading,
            accounts,
            activeAccount
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>
        // Done
        return (
            <div>
                <AccountList accounts={accounts} activeAccount={activeAccount} />
                <TokenContract />
                <MarketContract />
            </div>
        )
    }
}

export default Wallet
