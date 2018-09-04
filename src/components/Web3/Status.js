import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import styles from './Status.module.scss'

class Web3Status extends PureComponent {
    constructor(props, context) {
        super(props, context)

        this.state = {
            network: null,
            activeAccount: null,
            popoverOpen: false
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

    togglePopover() {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }))
    }

    render() {
        const { activeAccount, network, popoverOpen } = this.state
        let indicatorClasses

        if (activeAccount && network === 'Kovan') {
            indicatorClasses = styles.statusIndicatorActive
        } else {
            indicatorClasses = styles.statusIndicatorCloseEnough
        }

        return (
            <div className={styles.web3Status}
                onMouseOver={() => this.togglePopover()}
                onMouseOut={() => this.togglePopover()}
                onTouchStart={() => this.togglePopover()}
            >
                <div className={indicatorClasses} />

                {popoverOpen && (
                    <div className={styles.web3Popover}>
                        <div className={styles.web3PopoverInfoline}>
                            {
                                network === 'Kovan'
                                    ? network
                                    : `${network} (Please connect to Kovan)`
                            }
                        </div>
                        <div className={styles.web3PopoverInfoline}><Truncate>{activeAccount}</Truncate></div>
                    </div>
                )}
            </div>
        )
    }
}

Web3Status.contextTypes = {
    web3: PropTypes.object
}

export default Web3Status
