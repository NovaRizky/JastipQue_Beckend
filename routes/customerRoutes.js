const customerRoutes = require("express").Router();
const customerController = require("../controllers/customerController");
const OrderHeaderController = require('../controllers/orderHeaderController')

customerRoutes.post("/handling", OrderHeaderController.handleResponse);
customerRoutes.get("/products", customerController.getProducts);
customerRoutes.get("/events", customerController.getEvents);
customerRoutes.get("/products/:productId", customerController.detailProduct);

module.exports = customerRoutes;
