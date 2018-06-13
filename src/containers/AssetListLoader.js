import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import AssetList from '../components/AssetList'
import { setActiveAsset } from '../actions'

export default connect(
    state => ({
        ...state.asset
    }),

    dispatch => ({
        handleClick: asset => {
            dispatch(setActiveAsset(asset))
            dispatch(push(`/datasets/${asset.id}`))
        }
    })
)(AssetList)
