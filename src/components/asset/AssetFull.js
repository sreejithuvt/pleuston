import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import AssetMedia from './AssetMedia'

import Button from '../atoms/Button'
import { Chart, Chart2 } from '../Chart'
import './AssetFull.css'

const Editable = ({ name, value, onFieldChange, onValueChange }) => (
    <input name={name} type="text" value={value} onChange={onValueChange} />
)

class AssetFull extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            isWritable: true
        }
    }

    onEdit(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const {
            abstract,
            datePeriod,
            handlePurchase,
            id,
            stats,
            date,
            publisher,
            token,
            tools,
            url
        } = this.props

        if (!id) return null

        const changeClasses = stats.change.includes('-') ? 'asset__change negative' : 'asset__change positive'

        return (
            <div className="asset-full">
                <div className="asset-grid">
                    <div className="asset-grid__col">
                        <p>
                            <AssetMedia url={url} />
                        </p>

                        <div className="asset__stats">
                            <p><strong>{stats.accepted}</strong> of curators accepted</p>
                            <p><strong>{stats.rejected}</strong> of curators rejected</p>
                            <p><strong>{stats.challenged}</strong> times challenged</p>
                            <p><strong>{stats.purchased}</strong> times purchased</p>
                        </div>

                        <div className="asset__actions">
                            <Button>View data structure</Button>
                        </div>

                        <p>
                            <span className="asset__label">Publisher</span>
                            {this.state.isWritable &&
                            <Editable
                                name="publisher"
                                value={publisher}
                                onFieldChange={this.onEdit}
                                onValueChange={this.onEdit}
                            />}
                            {!this.state.isWritable && publisher }
                            <button onClick={() => this.setState({ isWritable: !this.state.isWritable })}>Edit</button>
                        </p>

                        <p>
                            <span className="asset__label">Published</span> { date }
                        </p>
                        <p>
                            <span className="asset__label">ID</span> { id }
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
                                <span className="asset__label">Url</span>
                                <a href={url} rel="noopener noreferrer" target="_blank">{ url || 'Please purchase' }</a>
                            </p>
                        )}

                        <p className="asset__url">
                            <span className="asset__label">Token</span> { token || 'Please purchase' }
                        </p>

                        <div className="asset__actions">
                            <Button primary onClick={() => handlePurchase(id)}>Purchase</Button>
                            <Button primary>Curate</Button>
                        </div>
                    </div>
                    <div className="asset-grid__col">
                        <div className="asset__graph__label">
                            <div className="asset__symbol">XYZ</div>
                            <div className="asset__graph__description">Supply & cost</div>
                        </div>

                        <div className="asset__graph"><Chart2 /></div>

                        <div className="asset__graph__label">
                            <div className={changeClasses}>{stats.change}</div>
                            <div className="asset__graph__description">Exchange rate history</div>
                        </div>

                        <div className="asset__graph"><Chart /></div>
                    </div>
                </div>
            </div>
        )
    }
}

AssetFull.propTypes = {
    abstract: PropTypes.string,
    date: PropTypes.string,
    datePeriod: PropTypes.string,
    handlePurchase: PropTypes.func,
    id: PropTypes.string,
    publisher: PropTypes.string,
    stats: PropTypes.object,
    token: PropTypes.string,
    tools: PropTypes.string,
    url: PropTypes.string
}

AssetFull.defaultProps = {
    abstract: null,
    date: null,
    datePeriod: null,
    handlePurchase: null,
    id: null,
    publisher: null,
    stats: null,
    token: null,
    tools: null,
    url: null
}

export default AssetFull
