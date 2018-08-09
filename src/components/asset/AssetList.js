import React from 'react'
import PropTypes from 'prop-types'

import Asset from './Asset'
import Empty from '../atoms/Empty'

import './AssetList.css'

const AssetList = ({
    assets,
    handleClick
}) => (
    <div className="assets">
        {assets.length
            ? assets.map(asset => (
                <div
                    className="assets__tile assets_count"
                    key={asset.id}
                    onClick={() => handleClick(asset)}
                    onKeyPress={() => handleClick(asset)}
                    role="link"
                    tabIndex={0}>
                    <Asset asset={asset} />
                </div>
            )) : (
                <Empty title="No data sets found :-(" text="Have you checked your Keeper connection and selected an account?" />
            )}
    </div>
)

AssetList.propTypes = {
    assets: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default AssetList
