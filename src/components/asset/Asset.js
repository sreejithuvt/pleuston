import React from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import AssetMedia from './AssetMedia'
import './Asset.scss'

const Asset = ({
    asset
}) => (
    <div className="asset">
        <header className="asset__header">
            <h1 className="asset__title">{asset.metadata.name}</h1>
            <div className="asset__id">
                <Truncate>{asset.assetId}</Truncate>
            </div>
        </header>

        {asset.metadata.links && <AssetMedia title={asset.metadata.name} url={asset.metadata.links} />}

        <div className="asset__description">
            <Truncate lines={2}>{asset.metadata.description}</Truncate>
        </div>

        <div className="asset__meta">
            <div className="asset__price">{asset.price} Ọ</div>
            <div className="asset__date">{new Date(asset.metadata.date).toLocaleDateString('en-US')}</div>
            <div className="asset__publisher">
                {/* <Truncate>By: {asset.publisherId}</Truncate> */}
            </div>

        </div>
    </div>
)

Asset.propTypes = {
    asset: PropTypes.object.isRequired
}

export default Asset
