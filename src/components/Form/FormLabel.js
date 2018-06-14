import React from 'react'
import PropTypes from 'prop-types'
import './FormLabel.css'

const FormLabel = ({
    label,
    ...props
}) => (
    <label {...props} className="form__label">{label}</label> // eslint-disable-line jsx-a11y/label-has-for
)

FormLabel.propTypes = {
    label: PropTypes.string
}

FormLabel.defaultProps = {
    label: 'hello'
}

export default FormLabel
