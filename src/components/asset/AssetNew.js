import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'

import Button from '../atoms/Button'
import FormInput from '../atoms/Form/FormInput'
import FormHelp from '../atoms/Form/FormHelp'
import AssetNewModal from './AssetNewModal'
import IconAzure from '../../svg/azure.svg'

import styles from './AssetNew.module.scss'

class AssetNew extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this)
    }

    toggleModal(e) {
        e.preventDefault()
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }

    render() {
        const {
            handleSubmit,
            urlGetter,
            blobs
        } = this.props

        return (
            <Fragment>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form__group">
                        <FormInput label="Title" name="name" required component="input" type="text" placeholder="" value="samer" />
                        <FormHelp>The title of your data set.</FormHelp>
                    </div>
                    <div className="form__group">
                        <FormInput label="Description" name="description" required component="textarea" rows="5" placeholder="" />
                        <FormHelp>Describe your data set, explaining what the data represents and what it can be used for.</FormHelp>
                    </div>
                    <div className="form__group">
                        <FormInput label="Asset URL" name="links" required component="input" type="url" placeholder="e.g. https://url.com/dataset.zip" />

                        <FormHelp>Add a URL pointing to your data set asset or select it from cloud storage providers.</FormHelp>

                        <div className={styles.cloudstorage}>
                            <Button
                                link="true"
                                icon={IconAzure}
                                // onClick={urlGetter}
                                onClick={(e) => this.toggleModal(e)}
                            >
                                Azure
                            </Button>
                        </div>
                    </div>
                    <div className="form__group">
                        <FormInput label="Price" name="price" required type="number" component="input" placeholder="0" />
                        <FormHelp>Price of your data set asset in Ocean Tokens.</FormHelp>
                    </div>

                    <div className="form__group">
                        <FormInput label="Tags" name="tags" component="input" placeholder="e.g. climate, ocean, atmosphere, temperature, earth-science, public" />
                        <FormHelp>Categorize your data set by one or more tags.</FormHelp>
                    </div>
                    <div className="form__group">
                        <FormInput label="License" name="license" required component="input" placeholder="e.g. proprietary" />
                    </div>
                    <div className="form__group">
                        <FormInput label="Update Frequency" name="updateFrequency" component="select">
                            <option />
                            <option value="seldom">seldom</option>
                            <option value="annually">annually</option>
                            <option value="quarterly">quarterly</option>
                            <option value="never">never expected to get updated</option>
                        </FormInput>
                        <FormHelp>How often are updates expected (seldom, annually, quarterly, etc.), or is the resource static (never expected to get updated).</FormHelp>
                    </div>
                    <div className="form__group">
                        <Button primary="true" type="submit">Publish</Button>
                    </div>
                </form>

                <AssetNewModal
                    isOpen={this.state.isModalOpen}
                    handleCloseModal={this.toggleModal}
                    urlGetter={urlGetter}
                    blobs={blobs}
                />
            </Fragment>
        )
    }
}

AssetNew.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    urlGetter: PropTypes.func.isRequired,
    blobs: PropTypes.array.isRequired
}

const AssetNewForm = reduxForm({
    form: 'new_asset'
})(AssetNew)

export default AssetNewForm
