import { Component } from 'react'
import Web3 from 'web3'


class Web3Component extends Component {
    constructor(props) {
        super(props)

        // Init
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
        this.web3 = new Web3(this.web3Provider)
    }
}

export default Web3Component

