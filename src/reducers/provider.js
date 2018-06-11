const initialState = {
    web3: null,
    web3Provider: null,
}

const provider = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROVIDER_WEB3':
            return Object.assign({}, state, {
                web3: action.web3,
                web3Provider: action.web3Provider
            })
        default:
            return state
    }
}

export default provider
