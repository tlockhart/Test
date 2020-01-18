const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
        access: String, 
        refresh: String
});
// Schema is layout.  
// The model is the object itself, base on the schema that you can create a record for.

// Create the model from the above schema, using mongoose's model method
const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;