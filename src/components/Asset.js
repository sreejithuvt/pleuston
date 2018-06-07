import React from 'react'
import PropTypes from 'prop-types'
import TruffleContract from 'truffle-contract'

import Button from '../components/Button'
import Web3Component from './Web3Component'

import Market from '../contracts/Market'
import './Asset.css'

const AssetFull = ({
    abstract,
    datePeriod,
    stats,
    date,
    publisher,
    tools,
    url,
}) => {
    const urlHostname = new URL(url).hostname

    return (
        <div className="asset-full">
            <div className="asset-grid">
                <div className="asset-grid__col">
                    <div className="asset__stats">
                        <p><strong>{stats.accepted}</strong> of curators accepted</p>
                        <p><strong>{stats.rejected}</strong> of curators rejected</p>
                        <p><strong>{stats.challenged}</strong> times challenged</p>
                        <p><strong>{stats.purchased}</strong> times purchased</p>
                    </div>

                    <div className="asset__actions">
                        <Button>View data structure</Button>
                    </div>

                    <p className="asset__publisher">
                        <span className="asset__label">Publisher</span> { publisher }
                    </p>

                    <p className="asset__date">
                        <span className="asset__label">Published</span> { date }
                    </p>

                    {abstract && (
                        <p className="asset__abstract">
                            <span className="asset__label">Abstract</span> { abstract }
                        </p>
                    )}

                    {tools && (
                        <p className="asset__tools">
                            <span className="asset__label">Methods or Tools</span> { tools }
                        </p>
                    )}

                    {datePeriod && (
                        <p className="asset__date_period">
                            <span className="asset__label">Period of data gathering</span> { datePeriod }
                        </p>
                    )}

                    {url && (
                        <p className="asset__url">
                            <span className="asset__label">Url</span> <a href={url}>{ urlHostname }</a>
                        </p>
                    )}

                    <div className="asset__actions">
                        <Button primary>Purchase</Button>
                        <Button primary>Curate</Button>
                    </div>
                </div>
                <div className="asset-grid__col">
                    <p className="asset__graph">Look at me, I am a graph</p>
                </div>
            </div>
        </div>
    )
}

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
            caption,
            date,
            name,
            publisher,
            stats
        } = this.props

        // Loading
        if (loading) return <p>loading...</p>

        return (
            this.props.minimal ?
                <div className="asset">
                    <header className="asset__header">
                        <h1 className="asset__name">
                            { name }
                        </h1>
                        <h2 className="asset__caption">{ caption }</h2>
                    </header>

                    <div className="asset__publisher">{ publisher }</div>
                    <div className="asset__date">{ date }</div>

                    <footer className="asset__footer">
                        <div className="asset__symbol">XYZ</div>
                        <div className="asset__change positive">{stats.change}</div>
                    </footer>
                </div>
                :
                <AssetFull {...this.props} />
        )
    }
}

AssetFull.propTypes = {
    abstract: PropTypes.string,
    date: PropTypes.string,
    datePeriod: PropTypes.string,
    publisher: PropTypes.string,
    stats: PropTypes.object, // eslint-disable-line
    tools: PropTypes.string,
    url: PropTypes.string,
}

AssetFull.defaultProps = {
    abstract: null,
    date: null,
    datePeriod: null,
    publisher: null,
    stats: null,
    tools: null,
    url: null,
}

export default Asset
