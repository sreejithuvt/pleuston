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
            date,
            description,
            handlePurchase,
            id,
            license,
            publisher,
            tags,
            token,
            url,
            updateFrequency
        } = this.props

        if (!id) return null

        return (
            <div className="asset-full">
                <div className="asset-grid">
                    <div className="asset-grid__col">
                        <p>
                            <AssetMedia url={url} />
                        </p>

                        <div className="asset__actions">
                            <Button>View data structure</Button>
                        </div>

                        <p>
                            <span className="asset__label">Publisher</span> { publisher }
                        </p>

                        <p>
                            <span className="asset__label">Published</span> { date }
                        </p>
                        <p>
                            <span className="asset__label">ID</span> { id }
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

                        {url && (
                            <p className="asset__url">
                                <span className="asset__label">Url</span>
                                <a href={url} rel="noopener noreferrer" target="_blank">{ url || 'Please purchase' }</a>
                            </p>
                        )}

                        <p className="asset__token">
                            <span className="asset__label">Token</span> { token || 'Please purchase' }
                        </p>

                        {tags && (
                            <p className="asset__tags">
                                <span className="asset__label">Tags</span> { tags.map(tag => (tag)) }
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
                            <Button primary onClick={() => handlePurchase(id)}>Purchase</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AssetFull.propTypes = {
    description: PropTypes.string,
    date: PropTypes.string,
    handlePurchase: PropTypes.func,
    id: PropTypes.string,
    tags: PropTypes.array,
    license: PropTypes.string,
    publisher: PropTypes.string,
    token: PropTypes.string,
    updateFrequency: PropTypes.string,
    url: PropTypes.array
}

export default AssetFull
