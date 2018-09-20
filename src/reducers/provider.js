const initialState = {
    ocean: null
}

const provider = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROVIDERS':
            return Object.assign({}, state, {
                ocean: action.ocean
            })
        default:
            return state
    }
}

export default provider
