import newAssetTestingValues from '../constants'

const initialState = {
    links: '',
    blobs: []
}

const newAsset = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_LINKS':
            return Object.assign({}, state, {
                links: action.url,
                ...newAssetTestingValues
            })
        default:
            return state
    }
}

export default newAsset
