import { connect } from 'react-redux'

import Dataset from '../pages/Dataset'

export default connect(state => ({
    ...state.asset.activeAsset
}))(Dataset)
