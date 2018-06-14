import { connect } from 'react-redux'

import Header from '../components/Header'
import { getActiveAccount } from '../actions/index'

export default connect((state) => ({
    activeAccount: getActiveAccount(state)
}))(Header)
