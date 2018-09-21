import React from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'

import AssetFullLoader from '../containers/AssetFullLoader'

const Dataset = ({ caption, name }) => (
    <Layout narrow>
        <AssetFullLoader />
    </Layout>
)

Dataset.propTypes = {
    caption: PropTypes.string,
    name: PropTypes.string
}

export default Dataset
