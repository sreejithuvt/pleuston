import React from 'react'
// import TruffleContract from 'truffle-contract'
import MarketContract from './MarketContract'
import TokenContract from './TokenContract'
import Web3Component from './Web3Component'


class Wallet extends Web3Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            accounts: this.web3.eth.accounts.map((name) => (
                {
                    name,
                    balance: null
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
                balance: this.web3.eth.getBalance(account.name).toString()
            }
        ))
    }

    render() {
        const {
            loading,
            accounts,
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>
        // Done
        return (
            <div>
                {
                    accounts.map((account) => (
                        <div>
                            <div>{account.name}</div>
                            <div>{account.balance}</div>
                        </div>
                    ))
                }
                <TokenContract />
                <MarketContract />
            </div>
        )
    }
}

export default Wallet
