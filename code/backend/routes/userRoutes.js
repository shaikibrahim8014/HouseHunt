const express = require("express");
const authMiddleware = require("../middlewares/authMiddlware");

const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
  getAllBookingsForAdminController
} = require("../controllers/userController");

const router = express.Router();


router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgotpassword", forgotPasswordController);

router.get('/getAllProperties', getAllPropertiesController)

router.post("/getuserdata", authMiddleware, authController);

router.post("/bookinghandle/:propertyid", authMiddleware, bookingHandleController);

router.get('/getallbookings', authMiddleware, getAllBookingsController)
router.get('/admin/getallbookings', authMiddleware, getAllBookingsForAdminController);

module.exports = router;
