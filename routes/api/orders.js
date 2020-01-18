// Handles product related routes

// Conveniently handles routes with different endpoints
const router = require('express').Router();

// Import to direct to controller
const OrdersController = require('../../controllers/orders');

//Import check Auth MiddleWare
const checkAuth = require('./authenticators/check-auth');

// localhost:3000/orders/
router.route("/")
    .get(OrdersController.orders_get_all)
    .post(OrdersController.orders_create_order);
// router.get('/', checkAuth, OrdersController.orders_get_all);

// Example: Orders Post Request: Creates a new order
// {
// 	"quantity": 2,
// 	"productId": "5d744b0640ef285b687957f6"
// }
// localhost:3000/orders/
router.post('/', checkAuth, OrdersController.orders_create_order);

// localhost:3000/orders/5d75802fa50af037b063668d
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

// localhost:3000/orders/5d75802fa50af037b063668d
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;