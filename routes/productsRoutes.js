const productsRoutes = require("express").Router();
const productsControllers = require("../controllers/productsContollers");
const toUpload = require("../middlewares/upload-image-middleware");

productsRoutes.get("/", productsControllers.showAllProducts);
productsRoutes.post("/", toUpload.single("image"), productsControllers.createProducts);
productsRoutes.delete("/:productId", productsControllers.deleteProduct);
productsRoutes.patch("/:productId", productsControllers.patchStatus);
productsRoutes.put("/:productId", toUpload.single("image"), productsControllers.updateProduct);
productsRoutes.get("/:productId", productsControllers.getProductById);

module.exports = productsRoutes;
