import React from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import './Order.scss'

const Order = ({
    order
}) => (
    <div className="order asset">
        <header className="asset__header order__header">
            <h1 className="asset__title">{order.assetName}</h1>
            <div className="asset__id">
                <Truncate>{order._id}</Truncate>
            </div>
        </header>
    </div>
)

Order.propTypes = {
    order: PropTypes.object.isRequired
}

export default Order
