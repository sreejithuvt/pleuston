import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import OrderList from '../components/order/OrderList'
import { setActiveOrder } from '../actions'

export default connect(
    state => ({
        orders: Object.values(state.order.orders)
            .reverse()
    }),

    dispatch => ({
        handleClick: order => {
            dispatch(setActiveOrder(order._id))
            dispatch(push(`/orders/${order._id}`))
        }
    })
)(OrderList)
