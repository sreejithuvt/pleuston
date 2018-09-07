const initialState = {
    url: ''
}

const newAsset = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_URL':
            return Object.assign({}, state, {
                url: action.url
            })
        default:
            return state
    }
}

export default newAsset
