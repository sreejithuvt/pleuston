import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import styles from './Empty.module.scss'

const Empty = ({ title, text, action, actionLink, ...props }) => (
    <div className={styles.empty} {...props}>
        <h4 className={styles.emptyTitle}>{title}</h4>
        {text && <p className="empty__text">{text}</p>}
        {action && <NavLink to={actionLink}>{action}</NavLink>}
    </div>
)

Empty.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    action: PropTypes.string,
    actionLink: PropTypes.string
}

Empty.defaultProps = {
    title: 'Nothing found :-('
}

export default Empty
