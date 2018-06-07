import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

import Wallet from '../components/Wallet'
import logo from '../../node_modules/oceanprotocol-art/logo/logo-white.svg'
import './Header.css'

class Header extends Component {
    constructor() {
        super()
        this.state = {
            showModal: false
        }

        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
    }

    handleOpenModal() {
        this.setState({ showModal: true })
    }

    handleCloseModal() {
        this.setState({ showModal: false })
    }

    render() {
        const { activeAccount } = this.props

        return (
            <header className="header">
                <a className="header__logo" href="/">
                    <img alt="logo" className="header__logo__image" src={logo} />
                    <h1 className="header__title">
                        Pigeon market
                    </h1>
                </a>
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

                <ReactModal
                    contentLabel="Minimal Modal Example"
                    isOpen={this.state.showModal}>
                    <Wallet />
                    <button onClick={this.handleCloseModal}>Close Modal</button>
                </ReactModal>
            </header>
        )
    }
}

Header.propTypes = {
    activeAccount: PropTypes.object, // eslint-disable-line
}

export default Header
