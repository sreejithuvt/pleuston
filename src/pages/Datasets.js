import React from 'react'

import Layout from '../components/Layout'

import AssetFilterLoader from '../containers/AssetFilterLoader'
import AssetListLoader from '../containers/AssetListLoader'

const Datasets = () => (
    <Layout>
        <AssetFilterLoader />
        <AssetListLoader />
    </Layout>
)

export default Datasets
