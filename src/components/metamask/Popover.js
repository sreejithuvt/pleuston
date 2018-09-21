import styles from './Status.module.scss'
import Truncate from 'react-truncate'
import PropTypes from 'prop-types'
import React from 'react'

const Popover = ({ network, selectedAccount }) => (
    <div className={styles.metamaskPopover}>
        <div key={'network'} className={styles.metamaskPopoverInfoline}>
            Network: <strong>{network}</strong>
        </div>
        <div key={'accountName'} className={styles.metamaskPopoverInfoline}>
            Account: {selectedAccount ? <Truncate title={selectedAccount.name}>{selectedAccount.name}</Truncate> : 'No account selected'}
        </div>
        <div key={'balances-eth'} className={styles.metamaskPopoverInfoline}>
            Ether: {selectedAccount ? selectedAccount.balance.eth.toString() : ''}
        </div>
        <div key={'balances-ocn'} className={styles.metamaskPopoverInfoline}>
            Ocean Tokens: {selectedAccount ? selectedAccount.balance.ocn.toString() : ''}
        </div>
    </div>
)

Popover.propTypes = {
    network: PropTypes.string,
    selectedAccount: PropTypes.object
}

export default Popover
