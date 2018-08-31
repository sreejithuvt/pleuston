import React from 'react'
import PropTypes from 'prop-types'
import styles from './ScreenHeader.module.scss'

const ScreenHeader = ({ title, subtitle }) => (
    <header className={styles.screenHeader}>
        <h1 className={styles.screenTitle}>{title}</h1>
        {subtitle && <h2 className={styles.screenSubtitle}>{subtitle}</h2>}
    </header>
)

ScreenHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
}

ScreenHeader.defaultProps = {
    subtitle: ''
}

export default ScreenHeader
