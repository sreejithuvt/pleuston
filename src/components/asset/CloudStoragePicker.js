import React from 'react'
import PropTypes from 'prop-types'
import MultiSelectReact from 'multi-select-react'

import styles from './CloudStoragePicker.module.scss'

const CloudStoragePicker = ({ blobs, urlGetter }) => (
    <MultiSelectReact
        className={styles.select}
        name="selectBlobs"
        options={blobs}
        selectedBadgeClicked={urlGetter}
        isSingleSelect
    />
)

CloudStoragePicker.propTypes = {
    urlGetter: PropTypes.func.isRequired,
    blobs: PropTypes.array.isRequired
}

export default CloudStoragePicker
