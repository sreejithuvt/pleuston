import React from 'react'

import Layout from '../components/Layout'
import ScreenHeader from '../components/ScreenHeader'
import AssetNewLoader from '../containers/AssetNewLoader'

const NewDataset = () => (
    <Layout>
        <ScreenHeader title="Publish" subtitle="Publish a new data set" />
        <AssetNewLoader />
    </Layout>
)

NewDataset.propTypes = {

}

export default NewDataset
