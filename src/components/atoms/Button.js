import React from 'react'
import PropTypes from 'prop-types'
import './Button.css'

const Button = ({ children, ...props }) => {
    const classes = (props.primary === "true") ? 'button button--primary' : 'button'

    return (
        <button className={classes} {...props}>{children}</button>
    )
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    primary: PropTypes.string
}

Button.defaultProps = {
    primary: "false"
}

export default Button
