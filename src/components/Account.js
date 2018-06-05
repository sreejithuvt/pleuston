import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './Account.css'

const Account = ({ name, balance }) => (
    <div className="account--item">
        <Blockies seed={name} />
        <div>{name}</div>
        <div className="account--item--balance__container">
            <div className="account--item--balance">
                {balance}
            </div>
        </div>
    </div>
)

Account.propTypes = {
    balance: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

export default Account
