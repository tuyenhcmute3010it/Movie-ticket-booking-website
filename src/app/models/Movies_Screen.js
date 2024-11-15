const mongoose = require("mongoose");

const moviesScreenSchema = new mongoose.Schema({
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  screen_id: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
});

module.exports = mongoose.model("Movies_Screen", moviesScreenSchema);
