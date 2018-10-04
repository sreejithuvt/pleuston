import React from 'react'
import ReactDOM from 'react-dom'
import { Logger } from '@oceanprotocol/squid'

import thunk from 'redux-thunk'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { createBrowserHistory } from 'history'
import {
    ConnectedRouter as Router,
    connectRouter,
    routerMiddleware
} from 'connected-react-router'

import { Web3Provider } from 'react-web3'
import Web3Unavailable from './components/metamask/Unavailable'
import Web3AccountUnavailable from './components/metamask/AccountUnavailable'

import appReducer from './reducers'
import {
    getAccounts,
    getAssets,
    setProviders,
    getOrders
} from './actions/index'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

const history = createBrowserHistory()

const store = createStore(
    connectRouter(history)(appReducer),
    composeWithDevTools(
        applyMiddleware(thunk),
        applyMiddleware(routerMiddleware(history))
    )
)

registerServiceWorker()

window.addEventListener('load', () => {
    Logger.log('booting up pleuston')
    store.dispatch(setProviders())
        .then(() => {
            store.dispatch(getAssets())
            store.dispatch(getAccounts())
                .then(() => {
                    store.dispatch(getOrders())
                })
        })
})

ReactDOM.render(
    <Provider store={store}>
        <Web3Provider
            onChangeAccount={() => store.dispatch(getAccounts())}
            web3UnavailableScreen={() => <Web3Unavailable />}
            accountUnavailableScreen={() => <Web3AccountUnavailable />}
        >
            <Router history={history}>
                <App />
            </Router>
        </Web3Provider>
    </Provider>,
    document.getElementById('root')
)
