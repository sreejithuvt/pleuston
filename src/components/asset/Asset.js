import React from 'react'
import PropTypes from 'prop-types'

import AssetMedia from './AssetMedia'
import './Asset.css'


const Asset = ({
    asset,
}) => (
    <div className="asset">
        <header className="asset__header">
            <div className="asset__id">{ asset.id }</div>
            <h1 className="asset__name">
                { asset.name }
            </h1>
        </header>

        <div className="asset__meta">
            <h2 className="asset__caption">{ asset.abstract }</h2>
            <div className="asset__date">Date: { asset.date }</div>
            <div className="asset__publisher">By: { asset.publisher }</div>
        </div>
        <AssetMedia url={asset.url} />
        <aside className="asset__ticker">
            <div className="asset__symbol">XYZ</div>
            <div className={asset.stats.change.includes('-') ?
                'asset__change negative' :
                'asset__change positive'}>
                {asset.stats.change}
            </div>
        </aside>
    </div>
)

Asset.propTypes = {
    asset: PropTypes.object.isRequired
}


export default Asset
