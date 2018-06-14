import React from 'react'
import { Field } from 'redux-form'
import './FormInput.css'

const FormInput = ({
    ...props
}) => (
    <div className="input-wrap">
        <Field
            {...props}
            className="input" />
    </div>
)

export default FormInput
