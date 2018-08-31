import React from 'react'
import styles from './Unavailable.module.scss'

const Web3Unavailable = () => (
    <div className={styles.unavailable}>
        <div>
            <h1>Web3 Not Found</h1>

            <p>It seems that you are using a browser without Web3 capabilities. Please make sure that you are using a web3-capable browser like mist or parity. If you are using MetaMask or Parity extension, make sure that it is enabled.</p>
        </div>
    </div>
)

export default Web3Unavailable
