import { connect } from 'react-redux'

import Order from '../pages/Order'
import { getActiveOrder } from '../actions/index'

export default connect(state => ({
    ...getActiveOrder(state)
}))(Order)
