import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Asset from './Asset'

import './AssetList.css'

const AssetList = ({
    assets,
    handleClick
}) => (
    <div className="assets">
        <div className="assets__tile">
            <Link
                href="/datasets-new"
                to={{
                    pathname: '/datasets-new',
                }}>
                <div className="asset asset-new">
                    <div className="asset__plus">
                            +
                    </div>
                </div>
            </Link>
        </div>
        {
            Object.values(assets).map(asset => (
                <div
                    className="assets__tile assets_count"
                    key={asset.id}
                    onClick={() => handleClick(asset)}>
                    <Asset minimal asset={asset} />
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
