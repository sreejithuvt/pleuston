import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import AssetMedia from './AssetMedia'
import AssetFullMeta from './AssetFullMeta'

import Button from '../atoms/Button'
import styles from './AssetFull.module.scss'

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
            author,
            license,
            copyrightHolder,
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

        const Links = links.map((link) => (
            Object.keys(link).forEach((key) => (
                <a href={link[key]}>{key}</a>
            ))
        ))

        return (
            <div className={styles.assetFull}>
                <h1 className={styles.assetFullTitle}>{name}</h1>

                {contentUrls && contentUrls.length && (
                    <p>
                        <AssetMedia title={name} contentUrls={contentUrls} />
                    </p>
                )}

                <AssetFullMeta label="Publisher" item={publisherId} truncate />

                <AssetFullMeta label="Author" item={author} />

                {copyrightHolder && <AssetFullMeta label="Copyright holder" item={copyrightHolder} />}

                <AssetFullMeta label="Published" item={dateCreated} />

                <AssetFullMeta label="ID" item={assetId} truncate />

                {description && <AssetFullMeta label="Description" item={description} />}

                {contentUrls && contentUrls.length && (
                    <AssetFullMeta label="URL" item={contentUrls[0] || 'Please purchase'} link={contentUrls[0]} />
                )}

                {links.length > 0 && (
                    <AssetFullMeta label="Links" item={Links} />
                )}

                <AssetFullMeta label="Price" item={`${price} Ọ`} />
                <AssetFullMeta label="Token" item={token || 'Please purchase'} />

                {tags.length > 0 && (
                    <AssetFullMeta label="Tags" item={tags.map(tag => (tag))} />
                )}

                <AssetFullMeta label="License" item={license} />

                {additionalInformation.updateFrequency && (
                    <AssetFullMeta label="Update Frequency" item={additionalInformation.updateFrequency} />
                )}

                <div className={styles.assetFullActions}>
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
        author: PropTypes.string.isRequired,
        license: PropTypes.string.isRequired,
        copyrightHolder: PropTypes.string,
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
    curation: PropTypes.shape({
        rating: PropTypes.number.isRequired,
        numVotes: PropTypes.number.isRequired,
        schema: PropTypes.string
    }),
    additionalInformation: PropTypes.shape({
        updateFrequency: PropTypes.string
        // structuredMarkup: PropTypes.array
    })
}

export default AssetFull
