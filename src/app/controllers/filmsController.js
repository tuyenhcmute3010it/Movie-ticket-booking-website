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
  //[get]
  create(req, res, next) {
    res.render("courses/create");
  }
  //[Post]
  store(req, res, next) {
    // res.json(req.body);
    const formData = req.body;
    formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    const course = new Films(req.body);
    course
      .save()
      .then(() => res.redirect("/"))
      .catch((error) => {});
  }
  edit(req, res, next) {
    Films.findById(req.params.id)
      .then((course) =>
        res.render("courses/edit", { course: mongooseToObject(course) })
      )
      .catch(next);
  }
  // [PUT] / courses/:id
  update(req, res, next) {
    Films.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }
}
module.exports = new FilmsController();
