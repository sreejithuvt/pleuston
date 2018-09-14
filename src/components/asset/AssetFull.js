import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import AssetMedia from './AssetMedia'

import Button from '../atoms/Button'
import './AssetFull.scss'

// const Editable = ({ name, value, onFieldChange, onValueChange }) => (
//     <input name={name} type="text" value={value} onChange={onValueChange} />
// )

// Editable.propTypes = {
//     name: PropTypes.string,
//     value: PropTypes.string,
//     onFieldChange: PropTypes.func,
//     onValueChange: PropTypes.func
// }

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
            publisherId,
            handlePurchase,
            token,
            // OEP-08 Attributes
            // https://github.com/oceanprotocol/OEPs/tree/master/8
            base,
            // curation,
            additionalInformation
        } = this.props

        // OEP-08 Base Attributes
        const {
            name,
            description,
            dateCreated,
            // size,
            // author,
            license,
            // copyrightHolder,
            // encoding,
            // compression,
            // contentType,
            // workExample,
            contentUrls,
            links,
            // inLanguage,
            tags,
            price
        } = base

        return (
            <div className="assetfull">
                <h1 className="assetfull__title">{name}</h1>

                {contentUrls && contentUrls.length && (
                    <p>
                        <AssetMedia title={name} contentUrls={contentUrls} />
                    </p>
                )}

                <p>
                    <span className="assetfull__label">Publisher</span> <Truncate>{publisherId}</Truncate>
                </p>

                <p>
                    <span className="assetfull__label">Published</span> {dateCreated}
                </p>

                <p>
                    <span className="assetfull__label">ID</span> <Truncate>{assetId}</Truncate>
                </p>

                {description && (
                    <p className="assetfull__description">
                        <span className="assetfull__label">Description</span> {description}
                    </p>
                )}

                {contentUrls && contentUrls.length && (
                    <p className="assetfull__url">
                        <span className="assetfull__label">Url</span>
                        <a href={contentUrls[0]}>{contentUrls[0] || 'Please purchase' }</a>
                    </p>
                )}

                {links && links.length && (
                    <p className="assetfull__links">
                        <span className="assetfull__label">Links</span>
                        {
                            links.map((link) => (
                                Object.keys(link).forEach((key) => (
                                    <a href={link[key]}>{key}</a>
                                ))
                            ))
                        }
                    </p>
                )}

                <p className="assetfull__price">
                    <span className="assetfull__label">Price</span> {`${price} Ọ`}
                </p>

                <p className="assetfull__token">
                    <span className="assetfull__label">Token</span> {token || 'Please purchase'}
                </p>

                {tags && tags.length && (
                    <p className="assetfull__tags">
                        <span className="assetfull__label">Tags</span> {tags.map(tag => (tag))}
                    </p>
                )}

                {license && (
                    <p className="assetfull__license">
                        <span className="assetfull__label">License</span> {license}
                    </p>
                )}

                {additionalInformation.updateFrequency && (
                    <p className="assetfull__updateFrequency">
                        <span className="assetfull__label">Update Frequency</span> {additionalInformation.updateFrequency}
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
    publisherId: PropTypes.string,
    token: PropTypes.string,

    // OEP-08 Attributes
    // https://github.com/oceanprotocol/OEPs/tree/master/8
    base: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        dateCreated: PropTypes.date,
        // size: PropTypes.string.isRequired,
        // author: PropTypes.string.isRequired,
        license: PropTypes.string.isRequired,
        // copyrightHolder: PropTypes.string,
        // encoding: PropTypes.string,
        // compression: PropTypes.string,
        // contentType: PropTypes.string.isRequired,
        // workExample: PropTypes.string,
        contentUrls: PropTypes.array.isRequired,
        links: PropTypes.array,
        // inLanguage: PropTypes.string,
        tags: PropTypes.array,
        price: PropTypes.number.isRequired
    }),
    // curation: PropTypes.shape({
    //     rating: PropTypes.number.isRequired,
    //     numVotes: PropTypes.number.isRequired,
    //     schema: PropTypes.string
    // }),
    additionalInformation: PropTypes.shape({
        updateFrequency: PropTypes.string
        // structuredMarkup: PropTypes.array
    })
}

export default AssetFull
