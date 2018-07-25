import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import AccountList from '../components/account/AccountList'
import {
    getAssets,
    getCurrentAccountAssets,
    setActiveAccount
} from '../actions/index'

export default connect(
    state => ({
        ...state.account
    }),

    dispatch => ({
        handleClick: (account) => {
            dispatch(setActiveAccount(account))
            dispatch(getAssets())
            dispatch(getCurrentAccountAssets())
            dispatch(push('/datasets'))
        }
    })
)(AccountList)
