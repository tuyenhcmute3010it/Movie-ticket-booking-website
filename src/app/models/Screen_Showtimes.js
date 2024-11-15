const mongoose = require("mongoose");

const screenShowtimesSchema = new mongoose.Schema({
  screen_id: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
  showtime_id: { type: mongoose.Schema.Types.ObjectId, ref: "Showtimes" },
});

module.exports = mongoose.model("Screen_Showtimes", screenShowtimesSchema);
