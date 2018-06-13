import { connect } from 'react-redux'

import AssetNew from '../components/AssetNew'
import { putAsset } from '../actions/index'

export default connect(
    state => ({
        ...state.account
    }),

    dispatch => ({
        handlePublish: (id, url, token) => {
            dispatch(putAsset(id, url, token))
        }
    })
)(AssetNew)
