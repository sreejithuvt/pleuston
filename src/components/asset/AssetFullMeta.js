import React from 'react'
import PropTypes from 'prop-types'
import Truncate from 'react-truncate'

import styles from './AssetFullMeta.module.scss'

const AssetFullMeta = ({ label, item, truncate, link }) => (
    <div className={styles.metaLine}>
        <div className={styles.metaLabel}>{label}</div>
        <div className={styles.metaValue}>
            {
                truncate ? <Truncate>{item}</Truncate>
                    : link ? <a href={link}>{item}</a> : item
            }
        </div>
    </div>
)

AssetFullMeta.propTypes = {
    label: PropTypes.string.isRequired,
    item: PropTypes.any,
    link: PropTypes.string,
    truncate: PropTypes.bool
}

export default AssetFullMeta
