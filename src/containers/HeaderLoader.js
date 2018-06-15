import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import Header from '../components/Header'
import {
    getActiveAccount,
    makeItRain
} from '../actions/index'

export default connect(
    state => ({
        activeAccount: getActiveAccount(state)
    }),

    dispatch => ({
        handleClickAccount: () => {
            dispatch(makeItRain(1))
            dispatch(push('/'))
        },
        handleClickLogo: () => {
            dispatch(makeItRain(1))
            dispatch(push('/datasets/'))
        }
    })
)(Header)
