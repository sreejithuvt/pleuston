import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './Account.css'

const Account = ({
    balance,
    handleClick,
    image,
    name
}) => (
    <button className="account" onClick={handleClick}>
        {
            image || <Blockies className="account__image" seed={name} />
        }
        {
            typeof name === 'string' ?
                <h3 className="account__title">{name.slice(0, 25)}...</h3> : name
        }
        <div className="account__balance">
            {balance}
        </div>
    </button>
)

Account.propTypes = {
    balance: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.element,
}

Account.defaultProps = {
    image: null
}

export default Account
