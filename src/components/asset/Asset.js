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
            <h1 className="asset__title">{asset.base.name}</h1>
            <div className="asset__id">
                <Truncate>{asset.assetId}</Truncate>
            </div>
        </header>

        {asset.base.contentUrls && <AssetMedia title={asset.base.name} contentUrls={asset.base.contentUrls} />}

        <div className="asset__description">
            <Truncate lines={2}>{asset.base.description}</Truncate>
        </div>

        <div className="asset__meta">
            <div className="asset__price">{asset.base.price} Ọ</div>
            <div className="asset__date">{new Date(asset.base.dateCreated).toLocaleDateString('en-US')}</div>
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
