import React from 'react'
import TruffleContract from 'truffle-contract'

import Button from './Button'
import Input from './Input'
import Web3Component from './Web3Component'

import Market from '../contracts/Market'
import './Asset.css'


class AssetNew extends Web3Component {
    constructor(props) {
        super(props)

        const contract = TruffleContract(Market)
        contract.setProvider(this.web3Provider)

        this.state = {
            contract,
            token: null,
            loading: false,
        }
    }

    componentDidMount = async () => {
    }

    handlePublish = async () => {

    }

    render() {
        const {
            loading,
            token
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        return (
            <div className="asset-full">
                <div className="asset-grid">
                    <div className="asset-grid__col">
                        <div className="asset__actions">
                            View data structure
                        </div>

                        <p>
                            <span className="asset__label">Publisher</span>
                            <Input />
                        </p>

                        <p>
                            <span className="asset__label">Published</span>date
                        </p>
                        <p>
                            <span className="asset__label">ID</span> id
                        </p>

                        <p className="asset__abstract">
                            <span className="asset__label">Abstract</span>abstract
                        </p>

                        <p className="asset__tools">
                            <span className="asset__label">Methods or Tools</span>tools
                        </p>

                        <p className="asset__date_period">
                            <span className="asset__label">Period of data gathering</span>
                        </p>

                        <p className="asset__url">
                            <span className="asset__label">Url</span> <a href={token}>{ token || 'Please purchase' }</a>
                        </p>

                        <Button primary onClick={this.handlePublish}>Publish</Button>
                    </div>
                </div>
            </div>
        )
    }
}


export default AssetNew
