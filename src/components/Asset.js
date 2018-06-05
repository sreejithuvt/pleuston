import React, { Fragment } from 'react'
import TruffleContract from 'truffle-contract'

import Web3Component from './Web3Component'

import Market from '../contracts/Market'

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
            description,
            id,
            name,
            schema,
            url
        } = this.props
        // Loading
        if (loading) return <p>loading...</p>

        return (
            <div className='asset-card'>
                <div className='asset-card__id'>{ id }</div>
                <div className='asset-card__name'>{ name }</div>
                <div className='asset-card__url'>{ url }</div>
                <div className='asset-card__description'>{ description }</div>
            </div>
        )
    }
}

export default AssetList
