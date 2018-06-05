import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './Account.css'

const Account = ({
    name,
    balance,
    onClick
}) => (
    <div // eslint-disable-line
        className="account"
        onClick={onClick}>
        <Blockies className="account__image" seed={name} />
        <h3 className="account__title">{name}</h3>
        <div className="account__balance">
            {balance}
        </div>
    </div>
)

Account.propTypes = {
    balance: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

export default Account
