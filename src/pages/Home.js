import React, { Fragment } from 'react'

import HeaderLoader from '../containers/HeaderLoader'
import AccountListLoader from '../containers/AccountListLoader'
import ScreenHeader from '../components/ScreenHeader'

const Home = () => (
    <Fragment>
        <HeaderLoader />
        <main className="screen screen--home">
            <ScreenHeader
                title="Select your account" />
            <AccountListLoader />
        </main>
    </Fragment>
)

export default Home
