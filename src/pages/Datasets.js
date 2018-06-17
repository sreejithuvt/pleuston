import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ScreenHeader from '../components/ScreenHeader'

import AssetFilterLoader from '../containers/AssetFilterLoader'
import AssetListLoader from '../containers/AssetListLoader'
import HeaderLoader from '../containers/HeaderLoader'


const Datasets = () => (
    <Fragment>
        <HeaderLoader />
        <main className="screen screen--datasets">
            <ScreenHeader title="Datasets" />
            <AssetFilterLoader />
            <AssetListLoader />
        </main>
    </Fragment>
)


Datasets.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default Datasets
