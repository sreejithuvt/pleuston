import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './OrderFull.css'

const Editable = ({ name, value, onFieldChange, onValueChange }) => (
    <input name={name} type="text" value={value} onChange={onValueChange} />
)

Editable.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onFieldChange: PropTypes.func,
    onValueChange: PropTypes.func
}

class OrderFull extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isWritable: false
        }
    }

    // onEdit(e) {
    //     this.setState({
    //         [e.target.name]: e.target.value
    //     })
    // }

    render() {
        const {
            id
        } = this.props

        if (!id) return null

        return (
            <div className="order-full">
                <div className="order-grid">
                    <div className="order-grid__col" />
                    <div className="order-grid__col" />
                </div>
            </div>
        )
    }
}

OrderFull.propTypes = {
    id: PropTypes.number
}

OrderFull.defaultProps = {
}

export default OrderFull
