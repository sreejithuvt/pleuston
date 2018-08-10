import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

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
                ? <h3 className="account__title">{name.slice(0, 25)}...</h3> : name
        }
        {image || <Blockies seed={name} />}
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
