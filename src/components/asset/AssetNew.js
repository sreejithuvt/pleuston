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
                <aside className="asset__ticker">
                    <Button primary type="submit">Publish</Button>
                </aside>
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
