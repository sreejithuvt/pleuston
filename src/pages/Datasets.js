import React from 'react'

import Layout from '../components/Layout'
import ScreenHeader from '../components/ScreenHeader'
import AssetListLoader from '../containers/AssetListLoader'

const Datasets = () => (
    <Layout>
        <ScreenHeader title="Data Sets" subtitle="See all your data sets" />
        <AssetListLoader />
    </Layout>
)

export default Datasets
