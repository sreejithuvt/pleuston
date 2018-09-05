import React from 'react'
import PropTypes from 'prop-types'

import './FormHelp.scss'

const FormHelp = ({ children }) => (
    <div className="form__help">
        {children}
    </div>
)

FormHelp.propTypes = {
    children: PropTypes.string
}

export default FormHelp
