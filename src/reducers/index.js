import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import account from './account'
import asset from './asset'
import contract from './contract'
import provider from './provider'

const appReducer = combineReducers({
    form: formReducer,
    account,
    asset,
    contract,
    provider,
})

export default appReducer
