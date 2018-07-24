import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ScreenHeader from '../components/ScreenHeader'
import HeaderLoader from '../containers/HeaderLoader'
import AssetNewLoader from '../containers/AssetNewLoader'

const DatasetsNew = () => (
    <Fragment>
        <HeaderLoader />
        <main className="screen screen--datasets">
            <ScreenHeader title="Publish New Dataset" />
            <AssetNewLoader />
        </main>
    </Fragment>
)

DatasetsNew.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default DatasetsNew
