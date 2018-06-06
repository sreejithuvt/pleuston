import React, { Fragment } from 'react'

import Header from '../components/Header'
import Wallet from '../components/Wallet'
import ScreenHeader from '../components/ScreenHeader'

const Home = () => (
    <Fragment>
        <Header />
        <main className="screen screen--home">
            <ScreenHeader
                title="Select your account" />
            <Wallet />
        </main>
    </Fragment>
)

export default Home
