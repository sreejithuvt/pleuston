import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
    {
        name: 'Home',
        route: '/'
    },
    {
        name: 'My Data',
        route: '/datasets'
    },
    {
        name: 'Orders',
        route: '/orders'
    },
    {
        name: 'History',
        route: '/history'
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
