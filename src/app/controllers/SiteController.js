//==================================================
const Films = require("../models/Films");
const { multipleMongooseToObject } = require("../../util/mongoose");
class siteController {
  index(req, res, next) {
    Films.find({ is_deleted: false }) // Lọc phim chưa bị ẩn
      .then((films) => {
        res.render("home", {
          films: multipleMongooseToObject(films),
        });
      })
      .catch(next);
  }
  search(req, res) {
    res.render("search");
  }
}

module.exports = new siteController();
