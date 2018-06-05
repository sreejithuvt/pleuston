import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'
import classnames from 'classnames'

import './Account.css'

const Account = ({
    name,
    balance,
    isActive,
    handleClick
}) => (
    <div // eslint-disable-line
        className={classnames('account', { 'active': isActive })}
        onClick={handleClick}>
        <Blockies className="account__image" seed={name} />
        <h3 className="account__title">{name}</h3>
        <div className="account__balance">
            {balance}
        </div>
    </div>
)

Account.propTypes = {
    balance: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
}

export default Account
