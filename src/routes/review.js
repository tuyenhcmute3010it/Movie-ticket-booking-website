const express = require("express");
const route = express.Router();
const reviewController = require("../app/controllers/reviewController");
route.get("/createReview", reviewController.create);

module.exports = route;
