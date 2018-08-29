import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import logo from '@oceanprotocol/art/logo/logo-white.svg'
import AccountBalance from './account/AccountBalance'
import styles from './Header.module.scss'

const Header = ({
    activeAccount,
    handleClickAccount,
    handleClickLogo
}) => (
    <header className={styles.header}>
        <div className={styles.headerContent}>
            <div className={styles.headerLogo} onClick={handleClickLogo}>
                <img alt="logo" className={styles.headerLogoImage} src={logo} />
                <h1 className={styles.headerTitle}>Data Sets</h1>
            </div>
            <nav className={styles.headerMenu} onClick={handleClickAccount}>
                {
                    activeAccount ? (
                        <Fragment>
                            <span className={styles.headerMenuUser} title={activeAccount.name}>
                                {activeAccount.name}
                            </span>
                            <AccountBalance {...activeAccount.balance} />
                        </Fragment>
                    ) : (
                        'No account selected'
                    )
                }
            </nav>
        </div>
    </header>
)

Header.propTypes = {
    handleClickAccount: PropTypes.func.isRequired,
    handleClickLogo: PropTypes.func.isRequired,
    activeAccount: PropTypes.object
}

export default Header
