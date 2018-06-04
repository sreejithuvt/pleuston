import React from 'react'
import PropTypes from 'prop-types'
import './ScreenHeader.css'

const ScreenHeader = ({ title, subtitle }) => (
    <header className="screen__header">
        <h1 className="screen__title">{title}</h1>
        {subtitle && <h2 className="screen__subtitle">{subtitle}</h2>}
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
