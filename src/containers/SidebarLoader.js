import { connect } from 'react-redux'
// import { push } from 'connected-react-router'

import Sidebar from '../components/Sidebar'
import {
    getActiveAccount
} from '../actions/index'

export default connect(
    state => ({
        activeAccount: getActiveAccount(state)
    }),

    dispatch => ({
    })
)(Sidebar)
