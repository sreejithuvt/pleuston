import { connect } from 'react-redux'

import AssetNewForm from '../components/AssetNew'
import { putAsset } from '../actions/index'

export default connect(
    state => ({
        ...state.account
    }),

    dispatch => ({
        handlePublish: (id, url, token) => {
            dispatch(putAsset(id, url, token))
        },
        onSubmit: values => {
            dispatch(putAsset(values))
        }
    })
)(AssetNewForm)
