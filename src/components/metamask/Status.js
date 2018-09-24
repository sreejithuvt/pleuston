import React, { PureComponent } from 'react'
import styles from './Status.module.scss'
import Popover from './Popover'
import PropTypes from 'prop-types'

export default class MetaMaskStatus extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            popoverOpen: false
        }
    }

    togglePopover() {
        this.setState(prevState => ({
            popoverOpen: !prevState.popoverOpen
        }))
    }

    render() {
        const { popoverOpen } = this.state

        let indicatorClasses = styles.statusIndicatorCloseEnough

        if (this.props.activeAccount) {
            indicatorClasses = styles.statusIndicatorActive
        }

        return (
            <div className={styles.metamaskStatus}
                onMouseEnter={() => this.togglePopover()}
                onMouseLeave={() => this.togglePopover()}
                onTouchStart={() => this.togglePopover()}
            >
                <div className={indicatorClasses} />

                {popoverOpen && <Popover network={this.props.networkName} selectedAccount={this.props.activeAccount} />}
            </div>
        )
    }
}

MetaMaskStatus.propTypes = {
    networkName: PropTypes.string,
    activeAccount: PropTypes.object
}
