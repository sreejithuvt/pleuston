import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import AccountList from '../components/AccountList'
import { setActiveAccount } from '../actions/index'


export default connect(
    state => ({
        ...state.account
    }),

    dispatch => ({
        setActiveAccount: (account) => {
            dispatch(setActiveAccount(account))
            dispatch(push('/datasets'))
        }
    })
)(AccountList)
