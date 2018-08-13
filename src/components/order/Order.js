import React from 'react'
import PropTypes from 'prop-types'

import './Order.css'

const Order = ({
    order
}) => (
    <div className="order">
        <header className="order__header">
            <div className="order__id">{ order.id }</div>
        </header>

    </div>
)

Order.propTypes = {
    order: PropTypes.object.isRequired
}

export default Order
