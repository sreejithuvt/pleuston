import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import Button from '../atoms/Button'
import FormInput from '../atoms/Form/FormInput'
import FormLabel from '../atoms/Form/FormLabel'

import './Asset.css'

const AssetNew = ({
    handleSubmit
}) => (
    <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
            <h1 className="form__title">Publish a new asset</h1>
        </div>
        <div className="form__group">
            <FormLabel htmlFor="name" label="Title" />
            <FormInput required component="input" name="name" id="name" type="text" placeholder="The title of your asset" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="description" label="Abstract" />
            <FormInput required component="textarea" name="description" id="description" placeholder="Describe your asset" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="url" label="Url" />
            <FormInput required component="input" name="url" id="url" type="url" placeholder="https://url.com/" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="price" label="Price" />
            <FormInput required type="number" component="input" name="price" id="price" placeholder="Price in ocean tokens" />
        </div>
        <div className="form__group">
            <Button primary="true" type="submit">Publish</Button>
        </div>
    </form>
)

AssetNew.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

const AssetNewForm = reduxForm({
    form: 'new_asset'
})(AssetNew)

export default AssetNewForm
