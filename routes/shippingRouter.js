const ShippingController = require('../controllers/shippingController');
const shippingRouter = require('express').Router();

// *Available API*
shippingRouter.get('/', ShippingController.viewAllShipping);
shippingRouter.post('/', ShippingController.createNewShipping);
shippingRouter.get('/:id', ShippingController.getOneShipping);
shippingRouter.delete('/:id', ShippingController.deleteShipping);
shippingRouter.put('/:id', ShippingController.editShipping);

module.exports = shippingRouter;