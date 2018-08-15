import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import './Asset.css'

const AssetMedia = ({
    url,
    title
}) => (
    <Fragment>
        {
            url.match(/\.(jpeg|jpg|gif|png)$/) &&
            <img alt={title} className="asset__img" src={url} />
        }
    </Fragment>
)

AssetMedia.propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default AssetMedia
