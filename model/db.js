const GhumDB = "Database"

const user = {
    username: '',
    password: '',
    FirstName: '',
    lastName: '',
    contact: '',
    address: {
        name: '', //my_house
        address: {
            country: '',
            zip: 0
        },
    },
    order_details_id: [] //history
}

const menu = {
    _id: 0,
    title: '',
    category: '',
    price: 0.0,
    desc: ''
}

const order_details = {
    user_id: 0,
    totalPrice: 0, //sum of item.price
    paid_status: '', //paid, not yet paid
    delivery_status: '',
    order_status: '', //boolean
    payment_method: '',
    totalAmount: '',
    items: []
}

// ==================== //

const items = [
    {
        menu_id: 0,
        quantity: 0
    },
    {
        menu_id: 1,
        quantity: 0
    }
]