import React from 'react'
import { Link } from 'react-router-dom'
import TruffleContract from 'truffle-contract'

import Asset from './Asset'
import Web3Component from './Web3Component'

import Market from '../contracts/Market'

const mockAssets = [
    {
        id: '1234',
        name: 'Pigeon Race Data',
        schema: {
            pigeon: 'string',
            race: 'string',
            velocity: 'float'
        },
        publisher: 'Pigeon Inc.',
        date: '2018-04-21',
        url: 'https://bigchaindb.com/',
        abstract: 'In this statistical analysis, the fastest 25% of homing speeds in 5955 races conducted in West Germany on 194 days in 1973–1990 and the return rates in 18 pigeon races held in 1932–1957 in Italy were examined with respect to distance, cloud cover, wind, sferics, solar and magnetic variables.',
        tools: 'Drone footage',
        datePeriod: '2018-02-21 - 2018-04-21',
        stats: {
            accepted: '52%',
            rejected: '32.8%',
            challenged: '3',
            purchased: '142',
        }
    }
]


class AssetList extends Web3Component {
    constructor(props) {
        super(props)

        const contract = TruffleContract(Market)
        contract.setProvider(this.web3Provider)

        this.state = {
            contract,
            loading: false,
            assets: []
        }
    }

    componentDidMount = async () => {
        this.setState({ assets: mockAssets })
    }

    render() {
        const {
            loading,
            assets
        } = this.state

        // Loading
        if (loading) return <p>loading...</p>

        return (
            <div className="assets">
                {
                    assets.map(asset => (
                        <Link
                            href={`/datasets/${asset.id}`}
                            key={asset.id}
                            to={{
                                pathname: `/datasets/${asset.id}`,
                                state: {
                                    activeAccount: this.props.activeAccount,
                                    asset
                                }
                            }}>
                            <Asset minimal {...asset} />
                        </Link>
                    ))
                }
            </div>
        )
    }
}

export default AssetList
