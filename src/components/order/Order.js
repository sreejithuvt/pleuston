import React from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import './Order.css'

const Order = ({
    order
}) => (
    <div className="order asset">
        <header className="asset__header order__header">
            <div className="asset__id order__id">
                <Truncate>{order._id}</Truncate>
            </div>
        </header>
    </div>
)

Order.propTypes = {
    order: PropTypes.object.isRequired
}

export default Order
