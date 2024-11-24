const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Genres", genresSchema);
