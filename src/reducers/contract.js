const initialState = {
    market: null,
}

const contract = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CONTRACTS':
            return Object.assign({}, state, {
                ...action.contracts
            })
        default:
            return state
    }
}

export default contract
