import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'
import Truncate from 'react-truncate'

import './Account.css'
import AccountBalance from './AccountBalance'

const Account = ({
    balance,
    handleClick,
    image,
    name
}) => (
    <button className="account" onClick={handleClick}>
        {
            typeof name === 'string'
                ? <h3 className="account__title">
                    <Truncate>{name}</Truncate>
                </h3> : name
        }
        <div className="account__image">
            {image || <Blockies seed={name} />}
        </div>
        <div className="account__balance">
            <AccountBalance {...balance} />
        </div>
    </button>
)

Account.propTypes = {
    balance: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.element
}

Account.defaultProps = {
    image: null
}

export default Account
