import React from 'react'
import PropTypes from 'prop-types'
import './Empty.css'

const Empty = ({ title, text, ...props }) => (
    <div className="empty" {...props}>
        <h4 className="empty__title">{title}</h4>
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
