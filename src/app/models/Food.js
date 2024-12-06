const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  food_price: { type: Number, required: true },
});

module.exports = mongoose.model("Food", foodSchema);
