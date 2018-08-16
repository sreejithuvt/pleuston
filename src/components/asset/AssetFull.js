import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

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
            isWritable: false
        }
    }

    onEdit(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        if (!this.props.assetId) return null

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

        return (
            <div className="assetfull">
                <h1 className="assetfull__title">{name}</h1>

                {links && links.length && (
                    <p>
                        <AssetMedia title={name} url={links[0]} />
                    </p>
                )}

                <p>
                    <span className="assetfull__label">Publisher</span> <Truncate>{publisherId}</Truncate>
                </p>

                <p>
                    <span className="assetfull__label">Published</span> { date }
                </p>
                <p>
                    <span className="assetfull__label">ID</span> <Truncate>{assetId}</Truncate>
                </p>

                {description && (
                    <p className="assetfull__description">
                        <span className="assetfull__label">Description</span>
                        {/* {this.state.isWritable &&
                        <Editable
                            name="description"
                            value={description}
                            onFieldChange={this.onEdit}
                            onValueChange={this.onEdit}
                        />}
                        {!this.state.isWritable && description }
                        <button onClick={() => this.setState({ isWritable: !this.state.isWritable })}>Edit</button> */}
                    </p>
                )}

                {links && links.length && (
                    <p className="assetfull__url">
                        <span className="assetfull__label">Url</span>
                        <a href={typeof links === 'string' ? links : links[0]}
                            rel="noopener noreferrer" target="_blank">{ (typeof links === 'string' ? links : links[0]) || 'Please purchase' }</a>
                    </p>
                )}

                <p className="assetfull__token">
                    <span className="assetfull__label">Token</span> { token || 'Please purchase' }
                </p>

                {labels && (
                    <p className="assetfull__tags">
                        <span className="assetfull__label">Labels</span> { labels.map(label => (label)) }
                    </p>
                )}

                {license && (
                    <p className="assetfull__license">
                        <span className="assetfull__label">License</span> { license }
                    </p>
                )}

                {updateFrequency && (
                    <p className="assetfull__updateFrequency">
                        <span className="assetfull__label">Update Frequency</span> { updateFrequency }
                    </p>
                )}

                <div className="assetfull__actions">
                    <Button primary="true" onClick={() => handlePurchase(assetId)}>Purchase</Button>
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
