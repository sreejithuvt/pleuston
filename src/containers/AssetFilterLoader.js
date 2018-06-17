import { connect } from 'react-redux'

import AssetFilter from '../components/AssetFilter'

import { setAssetFilter } from '../actions'

const mapStateToProps = state => ({
    publishers: [...new Set(Object.values(state.asset.assets)
        .map(asset => asset.publisher))]
        .map(publisher => (
            {
                label: `${publisher.slice(0, 10)}...`,
                value: publisher
            })),
    activeFilter: state.asset.filter.publisher
})

export default connect(
    state => mapStateToProps(state),

    dispatch => ({
        handlePublisherChange: (filter) => {
            dispatch(setAssetFilter({ publisher: filter }))
        }
    })
)(AssetFilter)
