import React from 'react'
import './Footer.scss'

const Footer = () => (
    <footer className="footer">
        <small>&copy; {(new Date().getFullYear())} <a href="https://oceanprotocol.com">Ocean Protocol Foundation Ltd.</a> &mdash; All Rights Reserved</small>

        <nav className="footer__links">
            <a href="https://blog.oceanprotocol.com">Blog</a>
            <a href="https://twitter.com/oceanprotocol">Twitter</a>
            <a href="https://github.com/oceanprotocol">GitHub</a>
        </nav>
    </footer>
)

export default Footer
