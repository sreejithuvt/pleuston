import React from 'react'
import TruffleContract from 'truffle-contract'

import Account from './Account'
import OceanRain from './OceanRain'
import Web3Component from './Web3Component'

import OceanToken from '../contracts/OceanToken'
import logo from '../../node_modules/oceanprotocol-art/logo/logo.svg'


class TokenContract extends Web3Component {
    constructor(props) {
        super(props)

        const contract = TruffleContract(OceanToken)
        contract.setProvider(this.web3Provider)

        this.state = {
            balance: null,
            contract,
            isAccountVisible: true
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

    handleAccountClick = () => {
        this.setState({ isAccountVisible: !this.state.isAccountVisible })
    }

    render() {
        const {
            account,
        } = this.props

        const {
            loading,
            isAccountVisible,
            balance
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        // Done
        return (
            <Account
                balance={balance}
                image={<img alt="logo" className="header__logo__image" src={logo} />}
                name={isAccountVisible ? account.name : <OceanRain account={account} />}
                onClick={this.handleAccountClick} />
        )
    }
}

export default TokenContract
