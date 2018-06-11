import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Header from '../components/Header'
import ScreenHeader from '../components/ScreenHeader'
import AssetNew from '../components/AssetNew'


const DatasetsNew = props => {
    const { activeAccount } = props.location.state

    return (
        <Fragment>
            <Header activeAccount={activeAccount} />
            <main className="screen screen--datasets">
                <ScreenHeader title="Publish New Dataset" />
                <AssetNew activeAccount={activeAccount} />
            </main>
        </Fragment>
    )
}

DatasetsNew.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default DatasetsNew
