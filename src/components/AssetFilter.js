import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'


import './AssetFilter.css'

const AssetFilter = ({
    activeFilter,
    handlePublisherChange,
    publishers,

}) => (
    <div className="asset-filter">
        <Select
            className="basic-multi-select"
            classNamePrefix="select"
            isMulti
            name="colors"
            onChange={value => handlePublisherChange(value)}
            options={publishers}
            value={activeFilter} />
    </div>
)


AssetFilter.propTypes = {
    publishers: PropTypes.object
}

AssetFilter.defaultProps = {
    publishers: []
}

export default AssetFilter
