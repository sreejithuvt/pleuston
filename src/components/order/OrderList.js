import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Empty from '../atoms/Empty'
import Order from './Order'
import './OrderList.css'

const OrderList = ({
    orders,
    handleClick
}) => (
    orders.length ? (
        <Fragment>
            <div className="orders">
                {orders.map(order => (
                    <div
                        className="orders__tile assets_count"
                        key={order.id}
                        onClick={() => handleClick(order)}
                        onKeyPress={() => handleClick(order)}
                        role="link"
                        tabIndex={0}>
                        <Order order={order} />
                    </div>
                ))}
            </div>
        </Fragment>
    ) : (
        <Empty title="No purchases so far :-(" text="Buy some datasets then you can see the order status here.?" />
    )
)

OrderList.propTypes = {
    orders: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default OrderList
