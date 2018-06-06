import React from 'react'
import PropTypes from 'prop-types'
import TruffleContract from 'truffle-contract'

import Web3Component from './Web3Component'

import Market from '../contracts/Market'
import './Asset.css'

const AssetFull = props => (
    <div className="asset asset--full">
        <div className="asset__description">{ props.description }</div>
        <div className="asset__url">{ props.url }</div>
    </div>
)

class Asset extends Web3Component {
    constructor(props) {
        super(props)

        const contract = TruffleContract(Market)
        contract.setProvider(this.web3Provider)

        this.state = {
            loading: false,
        }
    }

    componentDidMount = async () => {
    }

    render() {
        const {
            loading
        } = this.state

        const {
            id,
            name
        } = this.props

        // Loading
        if (loading) return <p>loading...</p>

        return (
            this.props.minimal ?
                <div className="asset">
                    <h3 className="asset__name">
                        { name }
                        <span className="asset__id">{ id }</span>
                    </h3>
                </div>
                :
                <AssetFull {...this.props} />
        )
    }
}

AssetFull.propTypes = {
    description: PropTypes.string,
    url: PropTypes.string,
}

AssetFull.defaultProps = {
    description: 'No description added',
    url: 'No URL added',
}

export default Asset
