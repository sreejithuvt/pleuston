import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ScreenHeader from '../components/ScreenHeader'
import HeaderLoader from '../containers/HeaderLoader'
import AssetListLoader from '../containers/AssetListLoader'

const Datasets = () => (
    <Fragment>
        <HeaderLoader />
        <main className="screen screen--datasets">
            <ScreenHeader title="Datasets" />
            <AssetListLoader />
        </main>
    </Fragment>
)


Datasets.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default Datasets
