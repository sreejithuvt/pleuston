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
            value={activeFilter}
            isMulti
            name="colors"
            onChange={value => handlePublisherChange(value)}
            options={publishers} />
    </div>
)


AssetFilter.propTypes = {
    publishers: PropTypes.object
}

AssetFilter.defaultProps = {
    publishers: []
}

export default AssetFilter
