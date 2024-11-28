const express = require("express");
const route = express.Router();
const authController = require("../app/controllers/authController");
route.post("/store", authController.store);
route.get("/sign-in", authController.signIn);
route.get("/sign-up", authController.signUp);
route.post("/logined", authController.login);
route.get("/home-logined", authController.index);
route.get("/forgot-password", authController.forgotPassword);
route.get("/forgot-password-emailed", authController.Convert);
route.post("/forgot-password-emailed", authController.forgotPasswordEmailed);
route.get("/forgot-password-emailed", authController.Convert);
route.post("/verify-otp", authController.sendGmail);  // Đúng cho việc xác nhận OTP



module.exports = route;
