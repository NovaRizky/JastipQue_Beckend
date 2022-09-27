const router = require("express").Router();
const ControllerUser = require("../controllers/controllerUser");

router.post("/register", ControllerUser.register);
router.post("/customer/register", ControllerUser.registerCustomer);
router.post("/login", ControllerUser.login);
router.post("/customer/login", ControllerUser.loginCustomer);
router.get("/", ControllerUser.showUser);
router.post("/google-login", ControllerUser.googleLogin);

module.exports = router;
