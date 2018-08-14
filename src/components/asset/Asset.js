import React from 'react'
import PropTypes from 'prop-types'

import AssetMedia from './AssetMedia'
import './Asset.css'

const Asset = ({
    asset
}) => (
    <div className="asset">
        <header className="asset__header">
            <div className="asset__id">{ asset.id }</div>
            <h1 className="asset__name">
                { asset.name }
            </h1>
        </header>

        <div className="asset__meta">
            <h2 className="asset__caption">{ asset.description }</h2>
            <div className="asset__date">Date: { new Date(asset.date).toLocaleDateString('en-US')}</div>
            <div className="asset__publisher">By: {asset.publisher.slice(0, 25)}...</div>
            <div className="asset__price">Price: { asset.price }</div>
        </div>
        <AssetMedia url={asset.url} />
    </div>
)

Asset.propTypes = {
    asset: PropTypes.object.isRequired
}

export default Asset
