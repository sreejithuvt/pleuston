const initialState = {
    assets: [],
    activeAsset: null,
}

const account = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ASSETS':
            return Object.assign({}, state, {
                assets: action.assets
            })
        case 'SET_ACTIVE_ASSET':
            return Object.assign({}, state, {
                activeAsset: action.activeAsset
            })
        default:
            return state
    }
}

export default account
