import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import Button from '../atoms/Button'
import FormInput from '../atoms/Form/FormInput'
import FormLabel from '../atoms/Form/FormLabel'
import FormHelp from '../atoms/Form/FormHelp'

const AssetNew = ({
    handleSubmit
}) => (
    <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
            <FormLabel htmlFor="name" label="Title" />
            <FormInput required component="input" name="name" id="name" type="text" placeholder="" />
            <FormHelp>The title of your data set.</FormHelp>
        </div>
        <div className="form__group">
            <FormLabel htmlFor="description" label="Description" />
            <FormInput required component="textarea" name="description" id="description" placeholder="" />
            <FormHelp>Describe your data set, explaining what the data represents and what it can be used for.</FormHelp>
        </div>
        <div className="form__group">
            <FormLabel htmlFor="links" label="Url" />
            <FormInput required component="input" name="links" id="links" type="url" placeholder="e.g. https://url.com/dataset.zip" />
            <FormHelp>Add a URL pointing to your data set asset.</FormHelp>
        </div>
        <div className="form__group">
            <FormLabel htmlFor="price" label="Price" />
            <FormInput required type="number" component="input" name="price" id="price" placeholder="0" />
            <FormHelp>Price of your data set asset in Ocean Tokens.</FormHelp>
        </div>

        <div className="form__group">
            <FormLabel htmlFor="license" label="License" />
            <FormInput required component="input" name="license" id="license" placeholder="e.g. proprietary" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="labels" label="Labels" />
            <FormInput component="input" name="labels" id="labels" placeholder="e.g. climate, ocean, atmosphere, temperature" />
            <FormHelp>Labels can serve the role of multiple categories.</FormHelp>
        </div>
        <div className="form__group">
            <FormLabel htmlFor="classification" label="Classification" />
            <FormInput component="input" name="classification" id="classification" placeholder="e.g. public" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="industry" label="Industry" />
            <FormInput component="input" name="industry" id="industry" placeholder="e.g. Earth Sciences" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="category" label="Category" />
            <FormInput component="input" name="category" id="category" placeholder="e.g. Climate" />
        </div>
        <div className="form__group">
            <FormLabel htmlFor="keywords" label="Keywords" />
            <FormInput component="input" name="keywords" id="keywords" placeholder="e.g. climate, ocean, atmosphere, temperature" />
            <FormHelp>Can enhance search and find functions.</FormHelp>
        </div>
        <div className="form__group">
            <FormLabel htmlFor="updateFrequency" label="Update Frequency" />
            <FormInput component="input" name="updateFrequency" id="updateFrequency" placeholder="e.g. annually" />
            <FormHelp>How often are updates expected (seldom, annually, quarterly, etc.), or is the resource static (never expected to get updated).</FormHelp>
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
