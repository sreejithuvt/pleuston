import React from 'react'
// import PropTypes from 'prop-types'
import './Input.css'

const Input = ({ ...props }) => {
    const classes = 'input'

    return (
        <input className={classes} {...props} />
    )
}

Input.propTypes = {
}

Input.defaultProps = {
}

export default Input
