import { connect } from 'react-redux'
import MetamaskStatus from '../components/metamask/Status'
import {
    getActiveAccount,
    getNetworkName
} from '../actions/index'

export default connect(
    state => ({
        networkName: getNetworkName(state),
        activeAccount: getActiveAccount(state)
    })
)(MetamaskStatus)
