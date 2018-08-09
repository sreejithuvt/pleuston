import React from 'react'
import { NavLink } from 'react-router-dom'
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
            <li key={menuItem.name}>
                <NavLink exact to={menuItem.route} activeClassName="is-active">
                    {menuItem.name}
                </NavLink>
            </li>
        )}
    </ul>
)

export default Sidebar
