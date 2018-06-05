import React from 'react'

import Wallet from '../components/Wallet'
import ScreenHeader from '../components/ScreenHeader'
import './Dashboard.css'

const Dashboard = () => (
    <main className="screen screen--dashboard">
        <ScreenHeader
            title="Dashboard" />
        <Wallet />
    </main>
)

export default Dashboard
