import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import AssetList from '../components/asset/AssetList'
import { setActiveAsset } from '../actions'

export default connect(
    state => ({
        assets: Object.values(state.asset.assets)
            .filter(obj => {
                if (!!obj &&
                    state.asset.filter.publisher &&
                    state.asset.filter.publisher.length) {
                    return Object
                        .values(state.asset.filter.publisher)
                        .map(filterValue => filterValue.value)
                        .indexOf(obj.publisherId) > -1
                } else {
                    return true
                }
            })
            .reverse()
    }),

    dispatch => ({
        handleClick: asset => {
            dispatch(setActiveAsset(asset.assetId))
            dispatch(push(`/datasets/${asset.assetId}`))
        }
    })
)(AssetList)
