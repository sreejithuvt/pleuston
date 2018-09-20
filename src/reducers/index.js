import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import account from './account'
import asset from './asset'
import provider from './provider'
import order from './order'

const appReducer = combineReducers({
    form: formReducer,
    account,
    asset,
    provider,
    order
})

export default appReducer
