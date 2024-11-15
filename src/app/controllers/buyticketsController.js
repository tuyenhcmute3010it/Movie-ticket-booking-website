const Films = require("../models/Films");
const { mongooseToObject } = require("../../util/mongoose");
class BuyticketsController {
  // [GET] /courses/:slug
  showBuyTickets(req, res, next) {
    // Films.findOne({ slug: req.params.slug })
    //   .then((films) =>
    //     res.render("tickets/buytickets", { films: mongooseToObject(films) })
    //   )
    //   .catch(next);
    Films.findById(req.params.id)
      .then((films) =>
        res.render("tickets/buytickets", {
          films: mongooseToObject(films),
          isLoggedIn: true,
        })
      )
      .catch(next);
  }
}
module.exports = new BuyticketsController();
