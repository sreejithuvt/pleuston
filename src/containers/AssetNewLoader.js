/* eslint-disable no-console */
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import AssetNewForm from '../components/asset/AssetNew'
import {
    getActiveAccount,
    putAsset,
    pickFileFromStorage
} from '../actions/index'

export default connect(
    state => ({
        initialValues: { links: state.newAsset.url },
        activeAccount: getActiveAccount(state),
        enableReinitialize: true
    }),

    dispatch => ({
        handleSubmit: values => {
            dispatch(putAsset(values))
            dispatch(push('/datasets/'))
        },
        urlGetter: () => {
            dispatch(pickFileFromStorage())
        }
    })
)(AssetNewForm)
