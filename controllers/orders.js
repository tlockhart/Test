const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


exports.orders_get_all = (req, res, next) => {
    Order.find({})
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(documents => {
        let response = {
            count: documents.length,
            orders: documents.map(document => {
                return {
                    _id: document._id,
                    product: document.product,
                    quantity: document.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/orders/' + document._id
                    }
                };
            }),
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err,
        });
    });
};

exports.orders_create_order = (req, res, next) => {
    // find the document in the Product table that matches the ID sent in the request
    Product.findById(req.body.productId)
    .then(document => {
        // If the user enters an invalid productID, then send a 404 response.
        // Instead of retuning null
        if(!document) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        // Save the product in the order, and return the promise of the newly created order
        return order.save();   
    })
    // then chain the promise to send the response once resolved
    .then(document => {
        console.log(document);
        let response = {
            message: 'Order stored',
            createdOrder: {
                _id: document._id,
                product: document.product,
                quantity: document.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/api/orders/' + document._id
                }
            },
            
        };
        res.status(201).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(document => {
        // Handle the case where the orderId sent in the request is not valid
        // We want to send an error response, not a null record
        if (!document) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: document,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/api/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
};

exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(document => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/api/orders',
                body: {
                    productId: 'ID',
                    quantity: "Number"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
};