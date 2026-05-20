const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  author:       { type: String, required: true, trim: true },
  reviewer:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewerName: { type: String, required: true },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  content:      { type: String, required: true },
  excerpt:      { type: String },
  category:     { type: String, required: true, enum: [
    "Biographies & Memoirs","Business & Investing","Children's Books",
    "Christian Books","Comics & Graphic Novels","Computers & Internet",
    "Cooking, Food & Wine","Entertainment","Health, Mind & Body",
    "History","Home & Garden","Literature & Fiction","Mystery & Thrillers"
  ]},
  cover:        { type: String, default: "" },
  comments:     { type: Number, default: 0 },
  likes:        { type: Number, default: 0 },
  featured:     { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.pre("save", function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + "...";
  }
  next();
});

module.exports = mongoose.model("Review", reviewSchema);