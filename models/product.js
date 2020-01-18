const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    // Assign a serial string type to mongoose _id
    _id: mongoose.Schema.Types.ObjectId,
    name: { 
        type: String, 
        required: true 
    },
    value: { 
        type: Number, 
        required: true 
    },
    productImage: {
        type: String,
        required: true
        // required: false
    }
    // ,
    // shippingCost: {
    //     type: Number, 
    //     required: false 
    // },
    // sellerView: {
    //     type: Boolean,
    //     default: true
    // },
    // publicView: {
    //     type: Boolean,
    //     default: false
    // },
    // date: {
    //     type: Date,
    //     // `Date.now()` returns the current unix timestamp as a number
    //     default: Date.now
    //   }
});
// Schema is layout.  
// The model is the object itself, base on the schema that you can create a record for.

// Create the model from the above schema, using mongoose's model method
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;