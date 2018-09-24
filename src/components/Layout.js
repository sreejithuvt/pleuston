import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import HeaderLoader from '../containers/HeaderLoader'
import SidebarLoader from '../containers/SidebarLoader'

import Spinner from './atoms/Spinner'

import styles from './Layout.module.scss'

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

                <main className={styles.layout} {...this.props}>
                    <nav className={styles.layoutSidebar}>
                        <SidebarLoader />
                    </nav>
                    {loading ? <Spinner />
                        : this.props.narrow ? <div className={styles.narrow}>{this.props.children}</div> : this.props.children
                    }
                </main>
            </Fragment>
        )
    }
}

Layout.propTypes = {
    children: PropTypes.any.isRequired
}

export default Layout
