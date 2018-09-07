const initialState = {
    files: {}
}

const cloudStorage = (state = initialState, action) => {
    switch (action.type) {
        case 'CLOUD_FILES':
            return Object.assign({}, state, {
                files: action.files
            })
        default:
            return state
    }
}

export default cloudStorage
