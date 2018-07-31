const initialState = {
    assets: {},
    activeAsset: null,
    filter: {}
}

const asset = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ASSETS':
            return Object.assign({}, state, {
                assets: action.assets
            })
        case 'GET_MY_ASSETS':
            return Object.assign({}, state, {
                assets: action.myAssets
            })
        case 'SET_ACTIVE_ASSET':
            return Object.assign({}, state, {
                activeAsset: action.activeAsset
            })
        case 'SET_ASSET_FILTER':
            return Object.assign({}, state, {
                filter: action.filter
            })
        default:
            return state
    }
}

export default asset
