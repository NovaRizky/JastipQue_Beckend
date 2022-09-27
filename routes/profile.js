const router = require("express").Router();
const ControllerProfile = require("../controllers/controllerProfile");
const { authorizationProfile } = require("../middlewares/auth");

router.get("/", ControllerProfile.getAllProfile);
router.post("/", ControllerProfile.addProfile);
router.get("/:id", ControllerProfile.getOneProfile);
router.delete("/:id", authorizationProfile, ControllerProfile.deleteProfile);
router.put("/:id", authorizationProfile, ControllerProfile.updateProfile);

module.exports = router;
