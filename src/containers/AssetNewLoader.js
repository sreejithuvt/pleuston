import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import AssetNewForm from '../components/asset/AssetNew'
import {
    getActiveAccount,
    putAsset
} from '../actions/index'

export default connect(
    state => ({
        activeAccount: getActiveAccount(state)
    }),

    dispatch => ({
        onSubmit: values => {
            dispatch(putAsset(values))
            dispatch(push('/'))
        }
    })
)(AssetNewForm)
