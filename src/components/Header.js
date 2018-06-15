import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import logo from '../../node_modules/oceanprotocol-art/logo/logo-white.svg'
import './Header.css'

class Header extends Component {

    render() {
        const {
            activeAccount,
            handleClickLogo
        } = this.props

        return (
            <header className="header">
                <div className="header__logo" onClick={handleClickLogo}>
                    <img alt="logo" className="header__logo__image" src={logo} />
                    <h1 className="header__title">
                        Pigeon market
                    </h1>
                </div>
                <nav className="header__menu" onClick={this.handleOpenModal}> {/* eslint-disable-line */}
                    {
                        activeAccount ? (
                            <Fragment>
                                <span className="header__menu__user" title={activeAccount ? activeAccount.name : null}>
                                    {activeAccount.name.slice(0, 20)}...
                                </span>
                                <span className="header__menu__balance">Ọ {activeAccount.balance}</span>
                            </Fragment>
                        ) : (
                            'No account selected'
                        )
                    }
                </nav>
            </header>
        )
    }
}

Header.propTypes = {
    handleClickLogo: PropTypes.func.isRequired,
    activeAccount: PropTypes.object, // eslint-disable-line
}

export default Header
