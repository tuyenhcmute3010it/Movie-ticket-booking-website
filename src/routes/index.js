const newsRouter = require("./news");
const siteRouter = require("./site");
const filmsRouter = require("./films");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const adminRouter = require("./admin");
const buyticketsRouter = require("./buytickets");
const reviewRouter = require("./review");
const privacyRouter = require("./privacy");
const purchaseTicketsRouter = require("./tickets");
function route(app) {
  app.use("/news", newsRouter);
  app.use("/films", filmsRouter);
  app.use("/", siteRouter);
  app.use("/", authRouter);
  app.use("/admin", adminRouter);
  app.use("/profile", profileRouter);
  app.use("/buytickets", buyticketsRouter);
  app.use("/review", reviewRouter);
  app.use("/privacy", privacyRouter);
  app.use("/tickets", purchaseTicketsRouter);
}
module.exports = route;
