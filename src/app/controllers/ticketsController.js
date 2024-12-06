const Profile = require("../models/Auth");
const Ticket = require("../models/Tickets");
const { multipleMongooseToObject } = require("../../util/mongoose");
class TicketsController {
  // Controller action to show purchased tickets

  async showPurchasedTickets(req, res, next) {
    try {
      // Ensure that the session contains a user ID
      if (!req.session.userId) {
        return res.status(400).send("User is not logged in.");
      }

      // Retrieve user profile from the database
      const profile = await Profile.findById(req.session.userId);
      if (!profile) {
        return res.status(404).send("User not found");
      }

      // Query for tickets associated with the user's profile
      const tickets = await Ticket.find({ idUser: profile._id })
        .populate("idFilm")
        .populate("idShowtime");

      // Check if tickets were found
      if (!tickets.length) {
        return res.status(404).send("No tickets found");
      }

      Ticket.find({}).then((ticket) =>
        res.render("tickets/purchasedTickets", {
          isLoggedIn: true,
          ticket: multipleMongooseToObject(tickets),
        })
      );
    } catch (err) {
      console.error("Error fetching tickets:", err); // Enhanced logging
      res.status(500).send("Server error");
    }
  }
}

module.exports = new TicketsController();
