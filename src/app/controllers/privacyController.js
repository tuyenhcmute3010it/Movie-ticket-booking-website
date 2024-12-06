const Profile = require("../models/Auth");
const Films = require("../models/Films");
const Screen = require("../models/Screen");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
// [GET]
class PrivacyController {
  // [GET] /profile
  introduce(req, res, next) {
    res.render("privacy/introduce", {});
  }
  contactWithUs(req, res, next) {
    res.render("privacy/contactWithUs", {});
  }
  privacyPolicy(req, res, next) {
    res.render("privacy/privacyPolicy", {});
  }
  termOfPayment(req, res, next) {
    res.render("privacy/termOfPayment", {});
  }
  termOfTransaction(req, res, next) {
    res.render("privacy/termOfTransaction", {});
  }
  faq(req, res, next) {
    res.render("privacy/faq", {});
  }
}
module.exports = new PrivacyController();
