const initialState = {
    market: null,
}

const contract = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CONTRACT_MARKET':
            return Object.assign({}, state, {
                market: action.market
            })
        default:
            return state
    }
}

export default contract
