import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './Status.module.scss'

class Web3Status extends PureComponent {
    constructor(props, context) {
        super(props, context)

        this.state = {
            network: '',
            activeAccount: ''
        }
    }

    componentDidMount() {
        this.setAccount()
        this.setNetwork()
    }

    setNetwork() {
        const netId = this.context.web3.networkId

        switch (netId) {
            case '1':
                this.setState({ network: 'Main' })
                break
            case '2':
                this.setState({ network: 'Morden' })
                break
            case '3':
                this.setState({ network: 'Ropsten' })
                break
            case '4':
                this.setState({ network: 'Rinkeby' })
                break
            case '42':
                this.setState({ network: 'Kovan' })
                break
            default:
                this.setState({ network: 'unknown' })
        }
    }

    setAccount() {
        this.setState({ activeAccount: this.context.web3.selectedAccount })
    }

    render() {
        return (
            <div className={styles.web3Status}>
                {this.state.network} - {this.state.activeAccount}
            </div>
        )
    }
}

Web3Status.contextTypes = {
    web3: PropTypes.object
}

export default Web3Status
