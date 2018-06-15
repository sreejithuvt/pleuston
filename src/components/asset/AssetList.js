import React from 'react'
import PropTypes from 'prop-types'

import Asset from './Asset'
import AsseNewLoader from '../../containers/AssetNewLoader'

import './AssetList.css'

const AssetList = ({
    assets,
    handleClick
}) => (
    <div className="assets">
        <AsseNewLoader />
        {
            Object.values(assets)
                .reverse()
                .map(asset => (
                    <div
                        className="assets__tile assets_count"
                        key={asset.id}
                        onClick={() => handleClick(asset)}>
                        <Asset asset={asset} />
                    </div>
                ))
        }
    </div>
)

AssetList.propTypes = {
    assets: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default AssetList
