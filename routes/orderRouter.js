const OrderController = require('../controllers/orderController');
const orderRouter = require('express').Router();

// *Available API*
orderRouter.get('/', OrderController.viewAllOrder);
orderRouter.post('/', OrderController.postOrder);
orderRouter.delete('/:id', OrderController.deleteOrder);
orderRouter.put('/:id', OrderController.editOrder);

module.exports = orderRouter;