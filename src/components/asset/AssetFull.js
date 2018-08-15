import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import AssetMedia from './AssetMedia'

import Button from '../atoms/Button'
import './AssetFull.css'

const Editable = ({ name, value, onFieldChange, onValueChange }) => (
    <input name={name} type="text" value={value} onChange={onValueChange} />
)

Editable.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onFieldChange: PropTypes.func,
    onValueChange: PropTypes.func
}

class AssetFull extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isWritable: true
        }
    }

    onEdit(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const {
            assetId,
            handlePurchase,
            metadata: {
                // category,
                // classification,
                date,
                description,
                // format,
                // industry,
                // keywords,
                labels,
                license,
                // lifecycleStage,
                links,
                name,
                // note,
                // size,
                token,
                updateFrequency
            },
            publisherId
        } = this.props

        if (!assetId) return null

        return (
            <div className="asset-full">
                <div className="asset-grid">
                    <div className="asset-grid__col">
                        <h1>
                            { name }
                        </h1>
                        { links && links.length && (
                            <p>
                                <AssetMedia url={links[0]} />
                            </p>
                        )}

                        <div className="asset__actions">
                            <Button>View data structure</Button>
                        </div>

                        <p>
                            <span className="asset__label">Publisher</span> { publisherId }
                        </p>

                        <p>
                            <span className="asset__label">Published</span> { date }
                        </p>
                        <p>
                            <span className="asset__label">ID</span> { assetId }
                        </p>

                        {description && (
                            <p className="asset__description">
                                <span className="asset__label">Description</span>
                                {this.state.isWritable &&
                                <Editable
                                    name="description"
                                    value={description}
                                    onFieldChange={this.onEdit}
                                    onValueChange={this.onEdit}
                                />}
                                {!this.state.isWritable && description }
                                <button onClick={() => this.setState({ isWritable: !this.state.isWritable })}>Edit</button>
                            </p>
                        )}

                        {links && links.length && (
                            <p className="asset__url">
                                <span className="asset__label">Url</span>
                                <a href={typeof links === 'string' ? links : links[0]}
                                    rel="noopener noreferrer" target="_blank">{ (typeof links === 'string' ? links : links[0]) || 'Please purchase' }</a>
                            </p>
                        )}

                        <p className="asset__token">
                            <span className="asset__label">Token</span> { token || 'Please purchase' }
                        </p>

                        {labels && (
                            <p className="asset__tags">
                                <span className="asset__label">Labels</span> { labels.map(label => (label)) }
                            </p>
                        )}

                        {license && (
                            <p className="asset__license">
                                <span className="asset__label">License</span> { license }
                            </p>
                        )}

                        {updateFrequency && (
                            <p className="asset__updateFrequency">
                                <span className="asset__label">Update Frequency</span> { updateFrequency }
                            </p>
                        )}

                        <div className="asset__actions">
                            <Button primary onClick={() => handlePurchase(assetId)}>Purchase</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AssetFull.propTypes = {
    assetId: PropTypes.string,
    handlePurchase: PropTypes.func,
    metadata: PropTypes.object,
    publisherId: PropTypes.string
}

export default AssetFull
