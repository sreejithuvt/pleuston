import React from 'react'
import PropTypes from 'prop-types'
import './Button.css'

const Button = ({ label, ...props }) => (
    <button className="button" {...props}>{label}</button>
)

Button.propTypes = {
    label: PropTypes.string.isRequired
}

export default Button
