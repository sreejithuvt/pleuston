import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import MultiSelectReact from 'multi-select-react'

import styles from './CloudStoragePicker.module.scss'

export default class CloudStoragePicker extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            selection: null
        }
    }
    handleSelection(e) {
        if (e.currentTarget.class === styles.selected) {
            e.currentTarget.className = styles.file
        } else {
            e.currentTarget.className = styles.selected
        }

        if (this.state.selection === e.currentTarget) this.props.urlGetter()

        this.setState({ selection: e.currentTarget })
    }

    render() {
        const { blobs } = this.props

        return (
            <div className={styles.files}>
                {
                    blobs === undefined || blobs.length === 0 ? (
                        <div className={styles.empty}>
                            <span>No files found</span>
                        </div>
                    ) : (
                        blobs.map(blob => (
                            <span
                                key={blob}
                                onClick={(e) => this.handleSelection(e)}
                                className={styles.file}
                            >
                                {blob}
                            </span>
                        ))
                    )
                }
            </div>
            // <MultiSelectReact
            //     className={styles.select}
            //     name="selectBlobs"
            //     options={this.props.blobs}
            //     selectedBadgeClicked={this.props.urlGetter}
            //     isSingleSelect
            // />
        )
    }
}

CloudStoragePicker.propTypes = {
    urlGetter: PropTypes.func.isRequired,
    blobs: PropTypes.array.isRequired
}
