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
            'pigeon': 'string',
            'race': 'string',
            'velocity': 'float'
        },
        url: 'http://bigchaindb.com/',
        description: 'Abstract\n' +
        'In this statistical analysis, the fastest 25% of homing speeds in 5955 races conducted in West Germany on 194 ' +
        'days in 1973–1990 and the return rates in 18 pigeon races held in 1932–1957 in Italy were examined with respect ' +
        'to distance, cloud cover, wind, sferics, solar and magnetic variables.',
    },
    {
        id: '2334',
        name: 'Shark Race Data',
        schema: {
            'pigeon': 'string',
            'race': 'string',
            'velocity': 'float'
        },
        url: 'http://bigchaindb.com/',
        description: 'Abstract\n' +
        'In this statistical analysis, the fastest 25% of homing speeds in 5955 races conducted in West Germany on 194 ' +
        'days in 1973–1990 and the return rates in 18 pigeon races held in 1932–1957 in Italy were examined with respect ' +
        'to distance, cloud cover, wind, sferics, solar and magnetic variables.',
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
                            <Asset {...asset} />
                        </Link>
                    ))
                }
            </div>
        )
    }
}

export default AssetList
