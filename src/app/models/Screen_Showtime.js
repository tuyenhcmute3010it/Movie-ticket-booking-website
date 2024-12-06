const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screenShowtimesSchema = new mongoose.Schema({
  screen_id: { type: Number, required: true }, // screen_id as Number
  showtime_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtimes", // Reference to the Showtimes model
    required: true,
  },
});

module.exports = mongoose.model("Screen_Showtimes", screenShowtimesSchema);
