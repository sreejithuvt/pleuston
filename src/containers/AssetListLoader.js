import { connect } from 'react-redux'

import AssetList from '../components/AssetList'

export default connect(state => ({
    ...state.account,
    ...state.asset
}))(AssetList)
