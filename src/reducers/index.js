import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import account from './account'
import asset from './asset'
import contract from './contract'
import provider from './provider'
import order from './order'

const appReducer = combineReducers({
    form: formReducer,
    account,
    asset,
    contract,
    provider,
    order
})

export default appReducer
