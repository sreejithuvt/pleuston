import React from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import AssetMedia from './AssetMedia'
import './Asset.css'

const Asset = ({
    asset
}) => (
    <div className="asset">
        <header className="asset__header">
            <h1 className="asset__title">{asset.metadata.name}</h1>
            <Truncate className="asset__id">{asset.assetId}</Truncate>
        </header>

        {asset.metadata.links && <AssetMedia url={asset.metadata.links[0]} />}

        <Truncate lines={3} className="asset__description">{asset.metadata.description}</Truncate>

        <div className="asset__meta">
            <div className="asset__price">{asset.price} Ọ</div>
            <div className="asset__date">{new Date(asset.metadata.date).toLocaleDateString('en-US')}</div>
            <Truncate className="asset__publisher">By: {asset.publisherId}</Truncate>
        </div>
    </div>
)

Asset.propTypes = {
    asset: PropTypes.object.isRequired
}

export default Asset
