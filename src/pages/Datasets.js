import React from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'

import AssetFilterLoader from '../containers/AssetFilterLoader'
import AssetListLoader from '../containers/AssetListLoader'

const Datasets = () => (
    <Layout>
        <AssetFilterLoader />
        <AssetListLoader />
    </Layout>
)

Datasets.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default Datasets
