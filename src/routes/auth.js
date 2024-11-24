const express = require("express");
const route = express.Router();
const authController = require("../app/controllers/authController");
route.post("/store", authController.store);
route.get("/sign-in", authController.signIn);
route.get("/sign-up", authController.signUp);
route.post("/logined", authController.login);
route.get("/home-logined", authController.index);

module.exports = route;
