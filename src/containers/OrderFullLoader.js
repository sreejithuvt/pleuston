import { connect } from 'react-redux'

import OrderFull from '../components/order/OrderFull'
import {
    getActiveOrder
} from '../actions/index'

export default connect(
    state => ({
        ...getActiveOrder(state)
    })

    // dispatch => ({
    //     }
    // })
)(OrderFull)
