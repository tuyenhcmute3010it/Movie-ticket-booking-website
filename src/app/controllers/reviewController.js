const Profile = require("../models/Auth");
const Films = require("../models/Films");
const Screen = require("../models/Screen");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
// [GET]
class ReviewController {
  // [GET] /profile
  async create(req, res, next) {
    res.render("review/createReview", {
      isLoggedIn: true,
    });
  }
}
module.exports = new ReviewController();
