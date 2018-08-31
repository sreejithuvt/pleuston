import React from 'react'
import styles from './Unavailable.module.scss'

const Web3AccountUnavailable = () => (
    <div className={styles.unavailable}>
        <div>
            <h1>Web3 Account not selected</h1>
            Please select or login to MetaMask.
        </div>
    </div>
)

export default Web3AccountUnavailable
