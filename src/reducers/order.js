const initialState = {
    orders: {},
    activeOrder: null,
    filter: {}
}

const order = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ORDERS':
            return Object.assign({}, state, {
                orders: action.orders
            })
        case '':
            return Object.assign({}, state, {
                activeOrder: action.activeOrder
            })
        default:
            return state
    }
}

export default order
