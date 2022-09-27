const OrderHeaderController = require("../controllers/orderHeaderController");
const orderHeaderRouter = require("express").Router();

// *Available API*
orderHeaderRouter.get("/", OrderHeaderController.viewAllOrderHeader);
orderHeaderRouter.get("/store", OrderHeaderController.viewAllStoreOrderHeader);
orderHeaderRouter.post("/:id", OrderHeaderController.postOrderHeader);
orderHeaderRouter.delete("/:id", OrderHeaderController.deleteOrderHeader);
orderHeaderRouter.patch("/:id", OrderHeaderController.setStatusOrderHeader);

module.exports = orderHeaderRouter;
