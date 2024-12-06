const express = require("express");
const route = express.Router();
const privacyController = require("../app/controllers/privacyController");
route.get("/introduce", privacyController.introduce);
route.get("/contactWithUs", privacyController.contactWithUs);
route.get("/faq", privacyController.faq);
route.get("/privacyPolicy", privacyController.privacyPolicy);
route.get("/termOfPayment", privacyController.termOfPayment);
route.get("/termOfTransaction", privacyController.termOfTransaction);

module.exports = route;
