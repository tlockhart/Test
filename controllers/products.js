const mongoose = require('mongoose');

// import models
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
        // Get the fields you want
        .select('name value _id productImage')
        .exec()
        .then(documents => {
            const response = {
                count: documents.length,
                products: documents.map(document => {
                    return {
                        name: document.name,
                        value: document.value,
                        _id: document._id,
                        productImage: document.productImage,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/api/products/${document._id}`
                        }
                    }
                })
            }; //response
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.products_insert_product = (req, res, next) => {

    let insertProps = {};

    // Populate Properties to insert:
    for (let key of req.body) {
        // validate that data has been supplied
        if (key.value) {
            insertProps[key.propName] = key.value;
            // console.log("PRODUCTS: KEY/VALUE:", key.propName, " = ", key.value);
        }
    }
    console.log("insertProps.authToken:", insertProps.authToken);
 
    // if(true) {
    // create a new product document, to be sent in the request
    const product = new Product({

        // Create a unique ID
        _id: new mongoose.Types.ObjectId(),
        name: insertProps.name,
        value: insertProps.value,
        productImage: insertProps.productImage,
        // image: insertProps.productImage,
        // url: 
        // name: req.body.name,
        // value: req.body.value,
        // productImage: 'uploads/' + path[1]
    });

    // Save the document to the Product Mongodb:
    product
        .save()
        .then(result => {
            // console.log(result);
            // console.log("in controller result:", result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    value: result.value,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/products/'
                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
    // } //if
}; // product_insert_product.




exports.products_create_product = (req, res, next) => {
    // req.file is availabe with upload
    console.log(req.file);
    let path = req.file.path.split('\\');
    console.log("Path:", path[1]);
    // create a new product document, to be sent in the request
    const product = new Product({

        // Create a unique ID
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        value: req.body.value,
        productImage: 'uploads/' + path[1]
    });

    // Save the document to the Product Mongodb:
    product
        .save()
        .then(result => {
            // console.log(result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    value: result.value,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/products/' + result._id
                    }
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
};

exports.products_get_product = (req, res, next) => {
    // Extract the productId
    const id = req.params.productId;
    console.log("products_get_product", id);
    // Find document by id

    // Find a document by product id
    Product.findById(id)
        .select('name value _id productImage')
        .exec()
        .then(document => {
            // console.log(document);
            const product = {
                name: document.name,
                value: document.value,
                productImage: document.productImage,
                _id: document._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/api/products/' + document._id
                }
            };
            if (document) {
                res.status(200).json(product);
            }
            else {
                res.status(404).json({
                    message: 'No valid entry found for ID'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });
};

exports.products_update_product = (req, res, next) => {
    // Step 1: After the access token is verified, send a new access and refresh token
    console.log("IN PRODUCT UPDATE");

    const id = req.params.productId;
    const updateProps = {};
    // Step 2: Loop through the array of objects sent in the request, which will choose the field you want to update from the request body (name). The new object (updateProps) will have the field and value you want to update
    for (let key of req.body) {
        // validate that data has been supplied
        if (key.value) {
            updateProps[key.propName] = key.value;
        }
    }
    // Step 3: Perform the update
    Product.updateOne({ _id: id }, { $set: updateProps })
        .exec()
        .then(document => {
            // No data is returned on a Patch request
            // console.log('document:', document);
            const product = {
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/api/products/product/update/' + id
                }
            };
            res.status(200).json(product);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err: err
            });
        });
}; // products_update_product

exports.products_delete_product = (req, res, next) => {
    // res.status(200).json({
    //     message: 'Deleted product!',
    // }); 
    const id = req.params.productId;
    // Product.deleteOne( {_id: id} )
    Product.remove({ _id: id })
        .exec()
        .then(document => {
            // console.log("document:", document);
            const response = {
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/api/products/product/delete/' + id,
                    // body: { name: 'String', value: 'Number'}
                }
            };
            res.status(200).json(document);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
};