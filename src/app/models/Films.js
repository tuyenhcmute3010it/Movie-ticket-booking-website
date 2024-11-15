// const slug = require("mongoose-slug-generator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

// mongoose.plugin(slug);

const Films = new Schema(
  {
    title: { type: String, require: true },
    duration: { type: String, require: true },
    description: { type: String },
    release_date: { type: String, require: true },
    cast: { type: String },
    director: { type: String, require: true },
    poster_url: { type: String, require: true },
    trailer_url: { type: String, require: true },
    language: { type: String },
    country: { type: String },
    thumb_preview: { type: Array },
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tickets" }, // Reference to tickets
    review_id: { type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }, // Reference to reviews
    showtimes_id: { type: mongoose.Schema.Types.ObjectId, ref: "Showtimes" }, // Reference to showtimes
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);
Films.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Films", Films);
