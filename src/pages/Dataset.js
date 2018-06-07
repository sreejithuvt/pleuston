import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Header from '../components/Header'
import ScreenHeader from '../components/ScreenHeader'
import Asset from '../components/Asset'

const Dataset = props => {
    const { activeAccount, asset } = props.location.state

    return (
        <Fragment>
            <Header activeAccount={activeAccount} />
            <main className="screen screen--dataset">
                <ScreenHeader subtitle={asset.caption} title={asset.name} />
                <Asset {...asset} />
            </main>
        </Fragment>
    )
}

Dataset.propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line
}

export default Dataset
