const newsRouter = require("./news");
const siteRouter = require("./site");
const filmsRouter = require("./films");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const adminRouter = require("./admin");
const buyticketsRouter = require("./buytickets");
function route(app) {
  app.use("/news", newsRouter);
  app.use("/films", filmsRouter);
  app.use("/", siteRouter);
  app.use("/", authRouter);
  app.use("/profile", profileRouter);
  app.use("/admin", adminRouter);
  app.use("/buytickets", buyticketsRouter);
}
module.exports = route;
