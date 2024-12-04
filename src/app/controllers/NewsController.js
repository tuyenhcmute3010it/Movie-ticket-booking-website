//==================================================

class newsController {
  index(req, res) {
    res.render("news");
  }
  slug(req, res) {
    res.send("slug ne anh zzo");
  }
}
module.exports = new newsController();
