import { connect } from 'react-redux'

import OceanRain from '../components/account/OceanRain'
import {
    getActiveAccount,
    makeItRain
} from '../actions/index'

export default connect(
    state => ({
        activeAccount: getActiveAccount(state)
    }),

    dispatch => ({
        handleClick: () => dispatch(makeItRain(10))
    })
)(OceanRain)
