import React, { Fragment } from 'react'

import Header from '../components/Header'
import ScreenHeader from '../components/ScreenHeader'

const NotFound = () => (
    <Fragment>
        <Header />
        <main className="screen screen--404">
            <ScreenHeader
                subtitle="Shenanigans, page not found."
                title="404" />
        </main>
    </Fragment>
)

export default NotFound
