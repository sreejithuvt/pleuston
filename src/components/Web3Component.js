import { Component } from 'react'
import Web3 from 'web3'
import config from '../config'

class Web3Component extends Component {
    constructor(props) {
        super(props)

        // Init
        this.web3Provider = new Web3.providers.HttpProvider(`http://${config.keeperHost}:${config.keeperPort}`)
        this.web3 = new Web3(this.web3Provider)
    }
}

export default Web3Component

