const initialState = {
    blobs: {}
}

const cloudStorage = (state = initialState, action) => {
    switch (action.type) {
        case 'CLOUD_BLOBS':
            return Object.assign({}, state, {
                blobs: action.blobs
            })
        default:
            return state
    }
}

export default cloudStorage
