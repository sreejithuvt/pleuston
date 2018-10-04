/* eslint-disable no-console */
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import AssetNewForm from '../components/asset/AssetNew'
import {
    getActiveAccount,
    putAsset,
    handleBlobChosen
} from '../actions/index'
import newAssetClearValues from '../constants'

export default connect(
    state => ({
        initialValues: {
            ...state.newAsset,
            selectBlobs: state.cloudStorage.blobs
        },
        activeAccount: getActiveAccount(state),
        enableReinitialize: true,
        blobs: Object.values(state.cloudStorage.blobs).map((fileObject, index) => ({
            id: index,
            label: fileObject.blobName,
            value: false
        }))
    }),

    dispatch => ({
        onSubmit: values => {
            console.log('form values: ', values)
            dispatch(putAsset(values))
            dispatch(push('/'))
            dispatch({ type: 'GET_LINKS', links: '', ...newAssetClearValues })
        },
        urlGetter: (blobsList) => {
            dispatch(handleBlobChosen(blobsList))
        }
    })
)(AssetNewForm)
