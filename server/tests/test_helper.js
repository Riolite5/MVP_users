const Book = require("../models/Book");
const User = require("../models/User");

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const booksInDB = async () => {
  const books = await Book.find({});
  return books.map((b) => b.toJSON());
};
module.exports = usersInDb;
