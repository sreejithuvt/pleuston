import React from 'react'
import Spinner from '../atoms/Spinner'
import config from '../../../config/ocean.js'
import styles from './Unavailable.module.scss'

const Web3AccountUnavailable = () => (
    <div className={styles.unavailable}>
        <div>
            <Spinner />
            <h1>No Web3 account selected</h1>
            <p>Web3 is available but no account is selected. Please login to your account in e.g. Mist or MetaMask and connect to the {config.activeNetwork} network.</p>
        </div>
    </div>
)

export default Web3AccountUnavailable
