import React from 'react'
import PropTypes from 'prop-types'

import logo from '../../node_modules/oceanprotocol-art/logo/logo-white.svg'
import './Header.css'

const Header = ({ activeAccount }) => (
    <header className="header">
        <a className="header__logo" href="/">
            <img alt="logo" className="header__logo__image" src={logo} />
        </a>
        <nav className="header__menu">
            <span className="header__menu__user">{activeAccount ? activeAccount.name : 'No account selected'}</span>
        </nav>
    </header>
)

Header.propTypes = {
    activeAccount: PropTypes.object.isRequired, // eslint-disable-line
}

export default Header
