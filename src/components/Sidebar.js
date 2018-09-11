import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

const menuItems = [
    {
        name: 'Data Sets',
        route: '/'
    },
    {
        name: 'Publish',
        route: '/new'
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
