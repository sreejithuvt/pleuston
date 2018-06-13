import React from 'react'
import PropTypes from 'prop-types'

import Button from './Button'
import Input from './Input'

import './Asset.css'


const AssetNew = ({
    activeAccount,
    handlePublish
}) => (
    <div className="asset-full">
        <div className="asset-grid">
            <div className="asset-grid__col">
                <div className="asset__actions">
                            View data structure
                </div>

                <p>
                    <span className="asset__label">Publisher: { activeAccount && activeAccount.name }</span>
                    <Input />
                </p>

                <p>
                    <span className="asset__label">Published</span>date
                </p>
                <p>
                    <span className="asset__label">ID</span> id
                </p>

                <p className="asset__abstract">
                    <span className="asset__label">Abstract</span>abstract
                </p>

                <p className="asset__tools">
                    <span className="asset__label">Methods or Tools</span>tools
                </p>

                <p className="asset__date_period">
                    <span className="asset__label">Period of data gathering</span>
                </p>

                <Button primary onClick={() => handlePublish(42, 'http://www.robots.ox.ac.uk/~parg/pubs/theses/RichardMann_thesis.pdf', 'http://www.robots.ox.ac.uk/~parg/pubs/theses/RichardMann_thesis.pdf')}>Publish</Button>
            </div>
        </div>
    </div>
)

AssetNew.propTypes = {
    activeAccount: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
    }).isRequired,
    handlePublish: PropTypes.func.isRequired,
}

export default AssetNew
