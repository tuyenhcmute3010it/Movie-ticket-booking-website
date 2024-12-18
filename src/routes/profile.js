const express = require("express");
const route = express.Router();
const profileController = require("../app/controllers/profileController");
const adminController = require("../app/controllers/adminController");
route.get("/", profileController.index);
route.get("/edit", profileController.edit);
route.put("/edit", profileController.update);
route.get("/admin", profileController.adminProfile);
module.exports = route;
