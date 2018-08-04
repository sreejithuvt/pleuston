import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
    {
        name: 'My accounts',
        route: '/'
    },
    {
        name: 'Publish new',
        route: '/newdataset'
    },
    {
        name: 'My own data sets',
        route: '/datasets'
    },
    {
        name: 'Orders',
        route: '/orders'
    }
]

const Sidebar = () => (
    <ul className="sidebar">
        {menuItems.map(menuItem =>
            <Link to={menuItem.route}>
                {menuItem.name}
            </Link>
        )}
    </ul>
)

export default Sidebar
