const orderHeaderRouter = require("./orderHeaderRouter");
const orderRouter = require("./orderRouter");
const shippingRouter = require("./shippingRouter");
const customerRoutes = require("./customerRoutes");
const eventsRoutes = require("./eventsRoutes");
const productsRoutes = require("./productsRoutes");
const usersRoutes = require("./users.js");
const profileRoutes = require("./profile.js");
const messageRouter = require("./message");
const { authentication } = require("../middlewares/auth.js");
const routes = require("express").Router();

// *Available API*
routes.use("/pub", customerRoutes);
routes.use("/users", usersRoutes);
//routes.use(authentication); // application level middleware
routes.use("/shipping", shippingRouter);
routes.use("/orders", orderRouter);
routes.use("/order-header", orderHeaderRouter);
routes.use("/products", productsRoutes);
routes.use("/events", eventsRoutes);
routes.use("/profile", profileRoutes);
routes.use("/message", messageRouter);

module.exports = routes;
