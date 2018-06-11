import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Asset from './Asset'

import './AssetList.css'

const AssetList = ({
    activeAccount,
    assets
}) => (
    <div className="assets">
        <div className="assets__tile">
            <Link
                href="/datasets-new"
                to={{
                    pathname: '/datasets-new',
                    state: {
                        activeAccount
                    }
                }}>
                <div className="asset asset-new">
                    <div className="asset__plus">
                            +
                    </div>
                </div>
            </Link>
        </div>
        {
            assets.map(asset => (
                <div className="assets__tile assets_count" key={asset.id}>
                    <Link
                        href={`/datasets/${asset.id}`}
                        to={{
                            pathname: `/datasets/${asset.id}`,
                            state: {
                                activeAccount,
                                asset
                            }
                        }}>
                        <Asset minimal {...asset} />
                    </Link>
                </div>
            ))
        }
    </div>
)

AssetList.propTypes = {
    activeAccount: PropTypes.objectOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    assets: PropTypes.array.isRequired,
}

export default AssetList
