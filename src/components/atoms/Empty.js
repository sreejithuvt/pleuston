import React from 'react'
import PropTypes from 'prop-types'
import styles from './Empty.module.scss'

const Empty = ({ title, text, ...props }) => (
    <div className={styles.empty} {...props}>
        <h4 className={styles.emptyTitle}>{title}</h4>
        {text && <p className="empty__text">{text}</p>}
    </div>
)

Empty.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string
}

Empty.defaultProps = {
    title: 'Nothing found :-('
}

export default Empty
