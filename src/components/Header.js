import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import logo from '@oceanprotocol/art/logo/logo-white.svg'
import './Header.scss'
import AccountBalance from './account/AccountBalance'

const Header = ({
    activeAccount,
    handleClickAccount,
    handleClickLogo
}) => (
    <header className="header">
        <div className="header__content">
            <div className="header__logo" onClick={handleClickLogo}>
                <img alt="logo" className="header__logo__image" src={logo} />
                <h1 className="header__title">Data Sets</h1>
            </div>
            <nav className="header__menu" onClick={handleClickAccount}>
                {
                    activeAccount ? (
                        <Fragment>
                            <span className="header__menu__user" title={activeAccount.name}>
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
