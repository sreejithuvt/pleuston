import React from 'react'

import Layout from '../components/Layout'
import ScreenHeader from '../components/ScreenHeader'
import AssetNewLoader from '../containers/AssetNewLoader'

const NewDataset = () => (
    <Layout narrow>
        <ScreenHeader title="Publish" subtitle="Publish a new asset" />
        <AssetNewLoader />
    </Layout>
)

NewDataset.propTypes = {

}

export default NewDataset
