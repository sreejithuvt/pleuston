import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import Header from '../components/Header'
import { getActiveAccount } from '../actions/index'

export default connect(
    state => ({
        activeAccount: getActiveAccount(state)
    }),

    dispatch => ({
        handleClickLogo: () => dispatch(push('/datasets/'))
    })
)(Header)
