import React from 'react'
import TruffleContract from 'truffle-contract'
import Web3 from 'web3'

import Web3Component from './Web3Component'

import AssetFull from './AssetFull'
import Market from '../contracts/Market'
import './Asset.css'


class Asset extends Web3Component {
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


    handlePurchase = async () => {
        const { contract } = this.state
        const { activeAccount, id } = this.props

        const marketContract = await contract.deployed()
        const purchase = await marketContract.purchase(id, { from: activeAccount.name, gas: 100000 })
        this.setState({ token: this.web3.toAscii(purchase.logs[0].args._token) })
    }

    render() {
        const {
            loading,
            token
        } = this.state

        const {
            caption,
            date,
            id,
            name,
            publisher,
            stats
        } = this.props

        // Loading
        if (loading) return <p>loading...</p>

        const changeClasses = stats.change.includes('-') ? 'asset__change negative' : 'asset__change positive'

        return (
            this.props.minimal ?
                <div className="asset">
                    <header className="asset__header">
                        <h1 className="asset__name">
                            { name }
                        </h1>
                        <h2 className="asset__caption">{ caption }</h2>
                    </header>

                    <div className="asset__meta">
                        <div className="asset__publisher">{ publisher }</div>
                        <div className="asset__date">{ date }</div>
                        <div className="asset__date">{ id }</div>
                    </div>

                    <aside className="asset__ticker">
                        <div className="asset__symbol">XYZ</div>
                        <div className={changeClasses}>{stats.change}</div>
                    </aside>
                </div>
                :
                <AssetFull {...this.props} handlePurchase={this.handlePurchase} token={token} />
        )
    }
}


export default Asset
