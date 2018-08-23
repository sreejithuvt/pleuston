import React, { PureComponent } from 'react'
import { Field } from 'redux-form'
import './FormInput.css'

class FormInput extends PureComponent {
    constructor(props) {
        super(props)

        this.state = { isFocused: false }
    }

    handleFocus = () => {
        this.setState({ isFocused: true })
    }

    handleBlur = () => {
        this.setState({ isFocused: false })
    }

    render() {
        return (
            <div className={this.state.isFocused ? 'input-wrap is-focused' : 'input-wrap'}>
                <Field
                    className="input"
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    {...this.props} />
            </div>
        )
    }
}

export default FormInput
