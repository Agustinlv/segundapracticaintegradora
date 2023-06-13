import mongoose from 'mongoose';

const userModel = mongoose.model(
    'users',
    new mongoose.Schema({
        first_name: String,
        last_name: String,
        email: String,
        age: Number,
        password: String,
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
            default: null
        },
        role: {
            type: String,
            default: 'user'
        }
    })
);

export default userModel;