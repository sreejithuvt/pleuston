import React from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'

import AssetFullLoader from '../containers/AssetFullLoader'

const Dataset = ({ caption, name }) => (
    <Layout>
        <AssetFullLoader />
    </Layout>
)

Dataset.propTypes = {
    caption: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

export default Dataset
