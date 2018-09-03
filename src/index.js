import React from 'react'
import ReactDOM from 'react-dom'
import Logger from './logger'

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
import Web3Unavailable from './components/Web3/Unavailable'
import Web3AccountUnavailable from './components/Web3/AccountUnavailable'

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

function boot() {
    Logger.log('booting up pleuston') // eslint-disable-line no-console
    store.dispatch(setProviders()).then(() => {
        store.dispatch(getAssets())
        store.dispatch(getAccounts()).then(() => {
            store.dispatch(getOrders())
        })
    })
}

/* Das */boot()

ReactDOM.render(
    <Web3Provider
        web3UnavailableScreen={() => <Web3Unavailable />}
        accountUnavailableScreen={() => <Web3AccountUnavailable />}
        // onChangeAccount={null}
    >
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>
    </Web3Provider>,
    document.getElementById('root')
)
