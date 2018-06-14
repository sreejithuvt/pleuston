import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import Button from './Button'
import FormInput from './Form/FormInput'
import FormLabel from './Form/FormLabel'

import './Asset.css'

const AssetNew = ({
    activeAccount,
    handleSubmit
}) => (
    <div className="asset-full">
        <div className="asset-grid">
            <div className="asset-grid__col">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form__group">
                        <FormLabel htmlFor="name" label="Title" />
                        <FormInput required component="input" name="name" type="text" />
                    </div>
                    <div className="form__group">
                        <FormLabel htmlFor="abstract" label="Abstract" />
                        <FormInput required component="textarea" name="abstract" type="text" />
                    </div>
                    <div className="form__group">
                        <FormLabel htmlFor="url" label="Url" />
                        <FormInput required component="input" name="url" type="text" />
                    </div>
                    <Button primary type="submit">Publish</Button>
                </form>
            </div>
        </div>
    </div>
)

AssetNew.propTypes = {
    activeAccount: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired
}


const AssetNewForm = reduxForm({
    form: 'edit'
})(AssetNew)


export default AssetNewForm
