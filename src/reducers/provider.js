const initialState = {
    web3: null,
    db: null,
    ocnURL: ''
}

const provider = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROVIDERS':
            return Object.assign({}, state, {
                web3: action.web3,
                db: action.db,
                ocnURL: action.ocnURL
            })
        default:
            return state
    }
}

export default provider
