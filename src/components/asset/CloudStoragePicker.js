import React from 'react'
import MultiSelectReact from 'multi-select-react'
import Modal from '../atoms/Modal'
import styles from './CloudStoragePicker.module.scss'

const CloudStoragePicker = ({ ...props }) => (
    <Modal
        {...props}
        contentLabel="Select one or more files for publishing"
        title="Pick a data set"
    >
        <div className={styles.cloudStoragePicker}>
            <MultiSelectReact name="selectBlobs" options={props.blobs} selectedBadgeClicked={props.urlGetter} isSingleSelect />
        </div>
    </Modal>
)

export default CloudStoragePicker
