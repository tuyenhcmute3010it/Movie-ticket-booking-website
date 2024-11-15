const Films = require("../models/Films");
const { mongooseToObject } = require("../../util/mongoose");
class FilmsController {
  // [GET] /courses/:slug
  show(req, res, next) {
    Films.findOne({ slug: req.params.slug })
      .then((films) =>
        res.render("films/filmsDetail", { films: mongooseToObject(films) })
      )
      .catch(next);
  }
}
module.exports = new FilmsController();
