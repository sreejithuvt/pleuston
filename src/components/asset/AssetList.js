import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import Empty from '../atoms/Empty'
import AssetFilterLoader from '../../containers/AssetFilterLoader'
import Asset from './Asset'
import './AssetList.css'

const AssetList = ({
    assets,
    handleClick
}) => (
    assets.length ? (
        <Fragment>
            <AssetFilterLoader />
            <div className="assets">
                {assets.map(asset => (
                    <div
                        className="assets__tile assets_count"
                        key={asset.assetId}
                        onClick={() => handleClick(asset)}
                        onKeyPress={() => handleClick(asset)}
                        role="link"
                        tabIndex={0}>
                        <Asset asset={asset} />
                    </div>
                ))}
            </div>
        </Fragment>
    ) : (
        <Empty title="No data sets found :-(" text="Have you checked your Keeper connection and selected an account?" />
    )
)

AssetList.propTypes = {
    assets: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default AssetList
