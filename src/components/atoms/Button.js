import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.scss'

const Button = ({ children, ...props }) => {
    const classes = (props.primary === 'true') ? styles.buttonPrimary : styles.button

    return (
        <button className={classes} {...props}>{children}</button>
    )
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    primary: PropTypes.string
}

Button.defaultProps = {
    primary: 'false'
}

export default Button
