import React from 'react'
import Spinner from '../atoms/Spinner'
import styles from './Unavailable.module.scss'

const Web3AccountUnavailable = () => (
    <div className={styles.unavailable}>
        <div>
            <Spinner />
            <h1>No Web3 account selected</h1>
            <p>Web3 is available but no account is selected. Please select or login to MetaMask.</p>
        </div>
    </div>
)

export default Web3AccountUnavailable
