const initialState = {
    ocean: null,
    oceanAgent: null
}

const provider = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROVIDERS':
            return Object.assign({}, state, {
                ocean: action.ocean,
                oceanAgent: action.oceanAgent
            })
        default:
            return state
    }
}

export default provider
