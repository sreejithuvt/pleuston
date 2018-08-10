import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './AccountBalance.css'

const AccountBalance = ({
    eth,
    ocn
}) => (
    <Fragment>
        <span className="header__menu__balance">
            {
                (eth / 1e18).toFixed(2)
            } Ξ
        </span>
        <span className="header__menu__balance">
            {
                ocn.toFixed(0)
            } Ọ
        </span>
    </Fragment>
)

AccountBalance.propTypes = {
    eth: PropTypes.object.isRequired,
    ocn: PropTypes.object.isRequired
}

export default AccountBalance
