import React from 'react'
import Layout from '../components/Layout'
import ScreenHeader from '../components/ScreenHeader'
import AccountListLoader from '../containers/AccountListLoader'

const Home = () => (
    <Layout>
        <ScreenHeader title="Accounts" subtitle="Choose an account" />
        <AccountListLoader />
    </Layout>
)

export default Home
