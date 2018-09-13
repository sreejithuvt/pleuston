import React from 'react'

import './Asset.scss'

const AssetMedia = ({
    contentUrls,
    title
}) => (
    contentUrls[0].match(/\.(jpeg|jpg|gif|png)$/) &&
    <img alt={title} className="asset__img" src={contentUrls[0]} />
)

export default AssetMedia
