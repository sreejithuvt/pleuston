import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import logo from '../../node_modules/oceanprotocol-art/logo/logo-white.svg'
import './Header.css'
import AccountBalance from './account/AccountBalance'

const Header = ({
    activeAccount,
    handleClickAccount,
    handleClickLogo
}) => (
    <header className="header">
        <div className="header__logo" onClick={handleClickLogo}> {/* eslint-disable-line */}
            <img alt="logo" className="header__logo__image" src={logo} />
            <h1 className="header__title">
                    Pigeon market
            </h1>
        </div>
        <nav className="header__menu" onClick={handleClickAccount}> {/* eslint-disable-line */}
            {
                activeAccount ? (
                    <Fragment>
                        <span className="header__menu__user" title={activeAccount ? activeAccount.name : null}>
                            {activeAccount.name.slice(0, 20)}...
                        </span>
                        <AccountBalance {...activeAccount.balance} />
                    </Fragment>
                ) : (
                    'No account selected'
                )
            }
        </nav>
    </header>
)

Header.propTypes = {
    handleClickAccount: PropTypes.func.isRequired,
    handleClickLogo: PropTypes.func.isRequired,
    activeAccount: PropTypes.object, // eslint-disable-line
}

export default Header
