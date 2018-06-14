const initialState = {
    accounts: [],
    activeAccount: 0,
}

const account = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ACCOUNTS':
            return Object.assign({}, state, {
                accounts: action.accounts
            })
        case 'SET_ACTIVE_ACCOUNT':
            return Object.assign({}, state, {
                activeAccount: action.activeAccount
            })
        default:
            return state
    }
}

export default account
