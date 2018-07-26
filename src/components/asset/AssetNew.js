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
    <div className="assets__tile">
        <div className="asset asset-new">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__group">
                    <FormLabel htmlFor="name" label="Title" />
                    <FormInput required component="input" name="name" type="text" placeholder="The title of your asset" />
                </div>
                <div className="form__group">
                    <FormLabel htmlFor="abstract" label="Abstract" />
                    <FormInput required component="textarea" name="abstract" placeholder="Describe your asset" />
                </div>
                <div className="form__group">
                    <FormLabel htmlFor="url" label="Url" />
                    <FormInput required component="input" name="url" type="url" placeholder="https://url.com/" />
                </div>
                <div className="form__group">
                    <Button primary type="submit">Publish</Button>
                </div>
            </form>
        </div>
    </div>
)

AssetNew.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

const AssetNewForm = reduxForm({
    form: 'new_asset'
})(AssetNew)

export default AssetNewForm
