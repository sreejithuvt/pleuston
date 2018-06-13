import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ScreenHeader from '../components/ScreenHeader'
import AssetLoader from '../containers/AssetLoader'
import HeaderLoader from '../containers/HeaderLoader'

const Dataset = ({ caption, name }) => (
    <Fragment>
        <HeaderLoader />
        <main className="screen screen--dataset">
            <ScreenHeader subtitle={caption} title={name} />
            <AssetLoader />
        </main>
    </Fragment>
)

Dataset.propTypes = {
    caption: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}

export default Dataset
