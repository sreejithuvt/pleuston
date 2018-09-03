const initialState = {
    web3: null,
    oceanKeeper: null,
    oceanAgent: ''
}

const provider = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROVIDERS':
            return Object.assign({}, state, {
                web3: action.web3,
                oceanKeeper: action.oceanKeeper,
                oceanAgent: action.oceanAgent
            })
        default:
            return state
    }
}

export default provider
