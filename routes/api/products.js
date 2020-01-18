// Handles product related routes

const express = require('express');

// Conveniently handles routes with different endpoints
const router = express.Router();


// JWT Middleware to Authenticate routes:
const checkAuth = require('./authenticators/check-auth');

// Import to direct to controller
const ProductsController = require('../../controllers/products');


// Handle incoming requests from '/products':
// Second argument is a hand/er function
// localhost:3000/products/
router.get('/', ProductsController.products_get_all);

// Post request body:
// {
// 	"name": "Smurfs",
// 	"value": 12.99,
//  "productImage": tlockhart.png
// }

// 12/22: INSERT
/**********/
router.post('/product/insert/', checkAuth,ProductsController.products_insert_product);

// localhost:3000/products/5d75802fa50af037b063668d
router.get('/:productId', ProductsController.products_get_product);

// change data in the database (update)
// Patch Request Body: 
// [
// 	{
// 		"propName": "name",
// 		"value": "Harry Potter 7"
// 	},
// 	{
// 		"propName": "value",
// 		"value": "10"
// 	}
// ]
// localhost:3000/products/5d75802fa50af037b063668d
// NOTE: Authorization add 
router.patch('/product/update/:productId', checkAuth, ProductsController.products_update_product);

// localhost:3000/products/delte/5d75802fa50af037b063668d
// NOTE: Authorization added
router.delete('/product/delete/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;