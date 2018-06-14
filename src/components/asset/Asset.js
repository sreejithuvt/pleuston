import React from 'react'
import PropTypes from 'prop-types'

import AssetLoader from '../../containers/AssetLoader'
import './Asset.css'


const Asset = ({
    asset,
    minimal
}) => (
    minimal ?
        <div className="asset">
            <header className="asset__header">
                <h1 className="asset__name">
                    { asset.name }
                </h1>
                <h2 className="asset__caption">{ asset.caption }</h2>
            </header>

            <div className="asset__meta">
                <div className="asset__publisher">{ asset.publisher }</div>
                <div className="asset__date">{ asset.date }</div>
                <div className="asset__date">{ asset.id }</div>
            </div>

            <aside className="asset__ticker">
                <div className="asset__symbol">XYZ</div>
                <div className={asset.stats.change.includes('-') ?
                    'asset__change negative' :
                    'asset__change positive'}>{asset.stats.change}</div>
            </aside>
        </div>
        :
        <AssetLoader />
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
    }).isRequired,
    minimal: PropTypes.bool,
}

Asset.defaultProps = {
    minimal: false
}

export default Asset
