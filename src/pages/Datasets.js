import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Header from '../components/Header'
import ScreenHeader from '../components/ScreenHeader'
import AssetList from '../components/AssetList'

const Datasets = props => {
    const { activeAccount } = props.location.state

    return (
        <Fragment>
            <Header activeAccount={activeAccount} />
            <main className="screen screen--datasets">
                <ScreenHeader title="Datasets" />
                <AssetList activeAccount={activeAccount} />
            </main>
        </Fragment>
    )
}

Datasets.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default Datasets
