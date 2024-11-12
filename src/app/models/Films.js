// const slug = require("mongoose-slug-generator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
// mongoose.plugin(slug);

const Films = new Schema(
  {
    title: { type: String, require: true },
    duration: { type: String },
    description: { type: String },
    release_date: { type: String },
    cast: { type: String },
    director: { type: String },
    poster_url: { type: String },
    trailer_url: { type: String, require: true },
    language: { type: String },
    country: { type: String },
    thumb_preview: { type: Array },
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
