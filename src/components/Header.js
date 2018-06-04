import React from 'react'
import logo from '../../node_modules/oceanprotocol-art/logo/logo-white.svg'
import './Header.css'

const Header = () => (
    <header className="header">
        <a className="header__logo" href="/">
            <img alt="logo" className="header__logo__image" src={logo} />
        </a>
        <nav className="header__menu">
            <span className="header__menu__user">cryptoking@hodl.com</span>
            <a href="/">Logout</a>
        </nav>
    </header>
)

export default Header
