import { connect } from 'react-redux'

import AssetFull from '../components/asset/AssetFull'
import {
    getActiveAsset,
    purchaseAsset
} from '../actions/index'

export default connect(
    state => ({
        ...getActiveAsset(state)
    }),

    dispatch => ({
        handlePurchase: (id) => {
            dispatch(purchaseAsset(id))
        }
    })
)(AssetFull)
