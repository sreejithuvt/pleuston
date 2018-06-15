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
        handlePublish: (id, url, token) => {
            dispatch(putAsset(id, url, token))
        },
        onSubmit: values => {
            dispatch(putAsset(values))
            dispatch(push('/datasets/'))
        }
    })
)(AssetNewForm)
