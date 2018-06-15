import { connect } from 'react-redux'

import Dataset from '../pages/Dataset'
import { getActiveAsset } from '../actions/index'

export default connect(state => ({
    ...getActiveAsset(state)
}))(Dataset)
