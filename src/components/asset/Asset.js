import React from 'react'
import PropTypes from 'prop-types'

import AssetMedia from './AssetMedia'
import './Asset.css'

const Asset = ({
    asset
}) => (
    <div className="asset">
        <header className="asset__header">
            <div className="asset__id">{ asset.assetId }</div>
            <h1 className="asset__name">
                { asset.metadata.name }
            </h1>
        </header>

        <div className="asset__meta">
            <h2 className="asset__caption">{ asset.metadata.description }</h2>
            <div className="asset__date">Date: { new Date(asset.metadata.date).toLocaleDateString('en-US')}</div>
            <div className="asset__publisher">By: {asset.publisherId.slice(0, 25)}...</div>
            <div className="asset__price">Price: { asset.price }</div>
        </div>
        { asset.url && <AssetMedia url={asset.url} /> }
    </div>
)

Asset.propTypes = {
    asset: PropTypes.object.isRequired
}

export default Asset
