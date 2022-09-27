const router = require('express').Router();
const ControllerMessage = require('../controllers/controllerMessage');
const { authorizationStore, authorizationProduct } = require('../middlewares/auth');

router.get('/', ControllerMessage.getAllMessage)
// router.get('/store', ControllerMessage.getAllStore)
// router.get('/product', ControllerMessage.getAllProduct)
// router.delete('/store/:id', authorizationProduct, ControllerMessage.deleteProduct)

module.exports = router;