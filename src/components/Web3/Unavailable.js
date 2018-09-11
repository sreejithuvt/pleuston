import React from 'react'
import styles from './Unavailable.module.scss'

const Web3Unavailable = () => (
    <div className={styles.unavailable}>
        <div>
            <h1>Web3 Not Found</h1>
            <p>It seems that you are using a browser without Web3 capabilities. Please use a Web3-capable browser like <a href="https://github.com/ethereum/mist">Mist</a>. If you are using <a href="https://metamask.io">MetaMask</a>, make sure that it is enabled.</p>
        </div>
    </div>
)

export default Web3Unavailable
