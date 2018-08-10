import React from 'react'

import Layout from '../components/Layout'
import ScreenHeader from '../components/ScreenHeader'

import AssetFilterLoader from '../containers/AssetFilterLoader'
import AssetListLoader from '../containers/AssetListLoader'

const Datasets = () => (
    <Layout>
        <ScreenHeader title="Data Sets" subtitle="See all your data sets" />
        <AssetFilterLoader />
        <AssetListLoader />
    </Layout>
)

export default Datasets
