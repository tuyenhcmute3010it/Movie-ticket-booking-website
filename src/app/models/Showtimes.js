const mongoose = require("mongoose");

const showtimesSchema = new mongoose.Schema({
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
});

module.exports = mongoose.model("Showtimes", showtimesSchema);
