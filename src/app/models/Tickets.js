const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  seat_film: { type: String, required: true },
  date_film: { type: Date, required: true },
  time_film: { type: String, required: true },
  idFilm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Films",
    required: true,
  },
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  idShowtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtimes",
    required: true,
  },
  screen_film: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
