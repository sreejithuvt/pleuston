const initialState = {
    orders: null,
}

const order = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ORDERS':
            return Object.assign({}, state, {
                orders: action.orders,
            })
        default:
            return state
    }
}

export default order
