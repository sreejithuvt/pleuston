import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import HeaderLoader from '../containers/HeaderLoader'
import SidebarLoader from '../containers/SidebarLoader'

import Spinner from './atoms/Spinner'

import './Layout.scss'

class Layout extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            error: null
        }
    }

    componentDidMount() {
        this.setState({ loading: false })
    }

    componentWillUnmount() {
        this.setState({
            loading: true,
            error: null
        })
    }

    render() {
        const { loading } = this.state

        return (
            <Fragment>
                <HeaderLoader />

                <main className="layout" {...this.props}>
                    <nav className="layout__sidebar">
                        <SidebarLoader />
                    </nav>
                    <div className="layout__content">
                        {loading ? <Spinner /> : this.props.children}
                    </div>
                </main>
            </Fragment>
        )
    }
}

Layout.propTypes = {
    children: PropTypes.any.isRequired
}

export default Layout
