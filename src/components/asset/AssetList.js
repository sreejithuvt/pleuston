import React from 'react'
import PropTypes from 'prop-types'

import Asset from './Asset'
import AssetNewLoader from '../../containers/AssetNewLoader'

import './AssetList.css'

const AssetList = ({
    assets,
    handleClick
}) => (
    <div className="assets">
        <AssetNewLoader />
        {
            assets.map(asset => (
                <div
                    className="assets__tile assets_count"
                    key={asset.id}
                    onClick={() => handleClick(asset)}
                    onKeyPress={() => handleClick(asset)}
                    role="link"
                    tabIndex={0}>
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
