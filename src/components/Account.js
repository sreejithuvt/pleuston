import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './Account.css'

const Account = ({
    balance,
    image,
    name,
    onClick
}) => (
    <div // eslint-disable-line
        className="account"
        onClick={onClick}>
        {
            image || <Blockies className="account__image" seed={name} />
        }
        {
            typeof name === 'string' ?
                <h3 className="account__title">{name}</h3> : name
        }
        <div className="account__balance">
            {balance}
        </div>
    </div>
)

Account.propTypes = {
    balance: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    image: PropTypes.element // eslint-disable-line
}

export default Account
