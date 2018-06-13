import { connect } from 'react-redux'

import AssetFull from '../components/AssetFull'
import { purchaseAsset } from '../actions/index'

export default connect(
    state => ({
        ...state.asset.activeAsset
    }),

    dispatch => ({
        handlePurchase: (id) => {
            dispatch(purchaseAsset(id))
        }
    })
)(AssetFull)
