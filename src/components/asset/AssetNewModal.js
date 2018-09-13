import React from 'react'
import Modal from '../atoms/Modal'
import styles from './AssetNewModal.module.scss'
import CloudStoragePicker from './CloudStoragePicker'

const AssetNewModal = ({ ...props }) => (
    <Modal
        {...props}
        contentLabel="Select one or more files for publishing"
        title="Pick a data set"
    >
        <div className={styles.content}>

            <CloudStoragePicker
                urlGetter={props.urlGetter}
                blobs={props.blobs}
            />

        </div>
    </Modal>
)

export default AssetNewModal
