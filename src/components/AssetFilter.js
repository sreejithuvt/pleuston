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
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            name="colors"
            onChange={value => handlePublisherChange(value)}
            options={publishers}
            value={activeFilter} />
    </div>
)


AssetFilter.propTypes = {
    activeFilter: PropTypes.object,
    handlePublisherChange: PropTypes.func,
    publishers: PropTypes.object,
}

AssetFilter.defaultProps = {
    publishers: [],
    activeFilter: [],
    handlePublisherChange: null,
}

export default AssetFilter
