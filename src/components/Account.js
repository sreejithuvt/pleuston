import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './Account.css'

const Account = props => (
    <Link
        className="account"
        href="/datasets"
        to={{ pathname: '/datasets', state: { activeAccount: props } }}>
        {
            props.image || <Blockies className="account__image" seed={props.name} />
        }
        {
            typeof props.name === 'string' ?
                <h3 className="account__title">{props.name.slice(0, 25)}...</h3> : props.name
        }
        <div className="account__balance">
            {props.balance}
        </div>
    </Link>
)

Account.propTypes = {
    balance: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.element,
}

Account.defaultProps = {
    image: null
}

export default Account
