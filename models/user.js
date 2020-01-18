const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // Assign a serial string type to mongoose _id
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "visitor"
    },
    token: {
        // Note the objecID is not defined, anything passed into token must be an id be default
        type: Schema.Types.ObjectId,
        ref: "Token"
    }
    // ,
    // date: {
    //     type: Date,
    //     // `Date.now()` returns the current unix timestamp as a number
    //     default: Date.now
    // }
});

// Create the model from the above schema, using mongoose's model method
const User = mongoose.model('User', UserSchema);

module.exports = User;