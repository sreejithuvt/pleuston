import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'
import config from '../../../config/ocean.js'
import styles from './Status.module.scss'

export default class Web3Status extends PureComponent {
    constructor(props, context) {
        super(props, context)

        this.state = {
            network: null,
            selectedAccount: null,
            popoverOpen: false
        }
    }

    componentDidMount() {
        this.setAccount()
        this.setNetwork()
    }

    setNetwork() {
        const { networkId } = this.context.web3

        switch (networkId) {
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
        const { selectedAccount } = this.context.web3

        this.setState({ selectedAccount })
    }

    togglePopover() {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }))
    }

    render() {
        const { selectedAccount, network, popoverOpen } = this.state

        let indicatorClasses

        if (selectedAccount && network === config.activeNetwork) {
            indicatorClasses = styles.statusIndicatorActive
        } else if (selectedAccount) {
            indicatorClasses = styles.statusIndicatorCloseEnough
        } else {
            indicatorClasses = styles.statusIndicator
        }

        return (
            <div className={styles.web3Status}
                onMouseEnter={() => this.togglePopover()}
                onMouseLeave={() => this.togglePopover()}
                onTouchStart={() => this.togglePopover()}
            >
                <div className={indicatorClasses} />

                {popoverOpen && <Popover network={network} selectedAccount={selectedAccount} />}
            </div>
        )
    }
}

Web3Status.contextTypes = {
    web3: PropTypes.object
}

const Popover = ({ network, selectedAccount }) => (
    <div className={styles.web3Popover}>
        <div className={styles.web3PopoverInfoline}>
            {
                network === config.activeNetwork
                    ? <strong>{network}</strong>
                    : `${network} (Please connect to ${config.activeNetwork})`
            }
        </div>
        <div className={styles.web3PopoverInfoline}>
            {selectedAccount ? <Truncate title={selectedAccount}>{selectedAccount}</Truncate> : 'No account selected'}
        </div>
    </div>
)

Popover.propTypes = {
    network: PropTypes.string,
    selectedAccount: PropTypes.string
}
