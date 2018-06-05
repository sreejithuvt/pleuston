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
        <Blockies seed={name} />
        <div>{name}</div>
        <div className="account--item--balance__container">
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
