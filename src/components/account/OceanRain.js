import React from 'react'
import PropTypes from 'prop-types'

import Button from '../atoms/Button'

import './OceanRain.css'


const OceanRain = ({ handleClick }) => (
    <div className="ocean-rain">
        <Button
            className="button ocean-rain__button"
            onClick={handleClick}>
            Make it rain
        </Button>
    </div>
)

OceanRain.propTypes = {
    handleClick: PropTypes.func.isRequired,
}


export default OceanRain
