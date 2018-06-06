import React from 'react'
import TruffleContract from 'truffle-contract'

import Web3Component from './Web3Component'

import Market from '../contracts/Market'
import './Asset.css'

class AssetList extends Web3Component {
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
            // description,
            id,
            name,
            url
        } = this.props

        // Loading
        if (loading) return <p>loading...</p>

        return (
            <div className="asset">
                <h3 className="asset__name">
                    { name }
                    <span className="asset__id">{ id }</span>
                </h3>
                <div className="asset__url">{ url }</div>
                {/* <div className="asset__description">{ description }</div> */}
            </div>
        )
    }
}

export default AssetList
