import React from 'react'
import PropTypes from 'prop-types'
import SVG from 'react-inlinesvg'
import styles from './Button.module.scss'

const Button = ({ icon, children, ...props }) => {
    let classes

    if (props.primary) {
        classes = styles.buttonPrimary
    } else if (props.link) {
        classes = styles.link
    } else {
        classes = styles.button
    }

    return (
        <button className={classes} {...props}>
            {icon && <SVG className={styles.icon} src={icon} />}
            {children}
        </button>
    )
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    primary: PropTypes.string
}

export default Button
