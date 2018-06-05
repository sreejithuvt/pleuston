import React, { Fragment } from 'react'

import Account from './Account'
import AccountList from './AccountList'

import TokenContract from './TokenContract'
import Web3Component from './Web3Component'

import './Wallet.css'

class Wallet extends Web3Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            activeAccount: null,
            accounts: this.web3.eth.accounts.map((name) => (
                {
                    name,
                    balance: null
                }
            ))
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

    activateAccount = (account) => {
        this.setState({ activeAccount: account })
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

        if (!activeAccount) {
            return (
                <AccountList
                    accounts={accounts}
                    handleClick={this.activateAccount} />
            )
        }

        return (
            <Fragment>
                <div className="wallet">
                    <Account
                        {...activeAccount}
                        onClick={console.log('dummy')} />
                    <TokenContract
                        account={activeAccount} />
                </div>
            </Fragment>
        )
    }
}

export default Wallet
