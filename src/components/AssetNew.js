import React from 'react'
import PropTypes from 'prop-types'
// import { Form } from 'semantic-ui-react'
import { reduxForm, Field } from 'redux-form'
import Button from './Button'
import Input from './Input'

import './Asset.css'


const AssetNew = ({
    activeAccount,
    handleSubmit
}) => (
    <div className="asset-full">
        <div className="asset-grid">
            <div className="asset-grid__col">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="asset__label" htmlFor="name">Title</label>
                        <Field required component="input" name="name" type="text" />
                    </div>
                    <div>
                        <label className="asset__label" htmlFor="abstract">Abstract</label>
                        <Field required component="textarea" name="abstract" type="text" />
                    </div>
                    <div>
                        <label className="asset__label" htmlFor="url">Url</label>
                        <Field required component="input" name="url" type="text" />
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
