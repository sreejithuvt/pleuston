import React from 'react'
import Routes from './Routes'
import Footer from './components/Footer'

import './styles/global.scss'
import styles from './App.module.scss'

const App = () => (
    <div className={styles.app}>
        <Routes />
        <Footer />
    </div>
)

export default App
