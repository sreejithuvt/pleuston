import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
    {
        name: 'Accounts',
        route: '/'
    },
    {
        name: 'Data Sets',
        route: '/datasets'
    },
    {
        name: 'Publish',
        route: '/datasets/new'
    },
    {
        name: 'Orders',
        route: '/orders'
    }
]

const Sidebar = () => (
    <ul className="sidebar">
        {menuItems.map(menuItem =>
            <Link key={menuItem.name} to={menuItem.route}>
                {menuItem.name}
            </Link>
        )}
    </ul>
)

export default Sidebar
