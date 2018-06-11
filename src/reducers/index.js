import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import account from './account'

const appReducer = combineReducers({
    form: formReducer,
    router: routerReducer,
    account
})

export default appReducer
