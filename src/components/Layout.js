import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import HeaderLoader from '../containers/HeaderLoader'
import SidebarLoader from '../containers/SidebarLoader'

import './Layout.css'

const Layout = props => (
    <Fragment>
        <HeaderLoader />

        <main className="layout" {...props}>
            <SidebarLoader />
            <div className="layout__content">
                {props.children}
            </div>
        </main>
    </Fragment>
)

Layout.propTypes = {
    children: PropTypes.any.isRequired
}

export default Layout
