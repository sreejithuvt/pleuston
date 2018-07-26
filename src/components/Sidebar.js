import React from 'react'
import './Sidebar.css'

const Sidebar = () => (
    <nav className="layout__sidebar">
        <ul className="sidebar">
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/datasets">My Data</a>
            </li>
            <li>
                <a href="/orders">Orders</a>
            </li>
            <li>
                <a href="/history">History</a>
            </li>
        </ul>
    </nav>
)

export default Sidebar
