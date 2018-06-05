import React, { Fragment } from 'react'
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
            <Fragment>
                {
                    assets.map(asset => (
                        <Asset {...asset} />
                    ))
                }
            </Fragment>
        )
    }
}

export default AssetList
