const initialState = {
    accounts: [],
    activeAccount: 0
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

        // https://github.com/coopermaruyama/react-web3#redux-support
        case 'web3/RECEIVE_ACCOUNT':
            return {
                ...state,
                ethAddress: action.address
            }
        case 'web3/CHANGE_ACCOUNT':
            return {
                ...state,
                ethAddress: action.address
            }
        default:
            return state
    }
}

export default account
