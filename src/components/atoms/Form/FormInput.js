import React, { Fragment, PureComponent } from 'react'
import { Field } from 'redux-form'
import './FormInput.scss'

class FormInput extends PureComponent {
    constructor(props) {
        super(props)

        this.state = { isFocused: false }
    }

    render() {
        const { name, label, required } = this.props

        return (
            <Fragment>
                <label
                    htmlFor={name}
                    className={required ? 'form__label is-required' : 'form__label'}
                    title={required ? 'Required' : null}
                >
                    {label}
                </label>
                <div className={this.state.isFocused ? 'input-wrap is-focused' : 'input-wrap'}>
                    <Field
                        className="input"
                        id={name}
                        {...this.props}
                        onFocus={() => this.setState({ isFocused: true })}
                        onBlur={() => this.setState({ isFocused: false })}
                    />
                </div>
            </Fragment>
        )
    }
}

export default FormInput
