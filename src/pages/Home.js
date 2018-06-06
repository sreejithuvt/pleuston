import React from 'react'

import Wallet from '../components/Wallet'
import ScreenHeader from '../components/ScreenHeader'

const Home = () => (
    <main className="screen screen--home">
        <ScreenHeader
            title="Select your account" />
        <Wallet />
    </main>
)

export default Home
