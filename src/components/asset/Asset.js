import React from 'react'
import PropTypes from 'prop-types'

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
        {
            asset.url.match(/\.(jpeg|jpg|gif|png)$/) &&
            <div
                className="asset__img"
                style={{
                    backgroundImage: `url(${asset.url})`
                }} />
        }
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
    asset: PropTypes.objectOf({
        caption: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        publisher: PropTypes.string.isRequired,
        stats: PropTypes.object.isRequired, // eslint-disable-line
        token: PropTypes.string
    }).isRequired
}


export default Asset
