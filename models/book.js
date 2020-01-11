const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  url: { type: String, required: true },
  image: { type: String, required: false },
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  synopsis: String,
  date: { type: Date, default: Date.now }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
