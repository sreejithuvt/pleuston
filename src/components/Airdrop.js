import React, { Component } from 'react'
import Web3 from 'web3'
import promisify from 'util.promisify'


class Airdrop extends Component {
    constructor(props) {
        super(props)

        // Init
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
        this.web3 = new Web3(this.web3Provider)

        this.state = {
            loading: true,
            lucky: 'n/a',
            transaction: 'n/a'
        }
    }

    componentDidMount = async () => {
        // Get some props
        const { coinbase } = this.web3.eth
        let balance = this.web3.eth.getBalance(coinbase).toString()

        // Watch for change
        this.web3.eth.filter('latest').watch(() => {
            balance = this.web3.eth.getBalance(coinbase).toString()
            this.setState({ balance })
        })

        // Send some ether every second
        setInterval(this.doAirDrop, 1000)

        this.setState({ loading: false, coinbase, balance })
    }

    doAirDrop = async () => {
        const { accounts } = this.web3.eth
        const sendTransaction = promisify(this.web3.eth.sendTransaction)
        const to = accounts[Math.floor(accounts.length * Math.random())]
        const address = await sendTransaction({
            from: accounts[0],
            to,
            value: 10
        }).catch(console.error)

        this.setState({ lucky: to, transaction: address })
    }

    showAccount = lucky =>
        this.web3.eth.accounts.map((account) => (
            <li key={account} style={{ color: lucky === account ? 'red' : 'white' }}>
                {account}
                <ol>{this.web3.eth.getBalance(account).toString()}</ol>
            </li>
        ))

    render() {
        // Loading
        if (this.state.loading) return <p>loading...</p>

        // Done
        return (
            <div>
                <p>coinbase : {this.state.coinbase}</p>
                <p>balance : {this.state.balance}</p>
                <ul>{this.showAccount(this.state.lucky)}</ul>
                <p>lucky : {this.state.lucky}</p>
                <p>transaction : {this.state.transaction}</p>
            </div>
        )
    }
}

export default Airdrop
