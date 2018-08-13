import React from 'react'

import Layout from '../components/Layout'
import ScreenHeader from '../components/ScreenHeader'
import OrderListLoader from '../containers/OrderListLoader'

const Orders = () => (
    <Layout>
        <ScreenHeader title="Orders" subtitle="See all your data set orders" />
        <OrderListLoader />
    </Layout>
)

export default Orders
