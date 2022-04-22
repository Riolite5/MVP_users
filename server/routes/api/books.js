const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const Book = require("../../models/Book");
const { response } = require("express");
const User = require("../../models/User");

//@route GET api/books/test
//@description tests books route
//@access Public
router.get("/test", (req, res) => res.send("book router testing!"));

//enforce having a token to get all books
const getTokenFrom = (request) => {
  //capture token
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.split(" ")[1];
  }
  return null;
};
// get all books
router.get("/", async (req, res) => {
  //auth
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.JWT_KEY);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "missing or invalid token" });
  }
  const user = await User.findById(decodedToken.id);
  console.log(`Welcome ${user.userName}`);
  Book.find({})
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json({ nobooksfound: err.message }));
});

//get a specific book details
router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json({ nobookfound: "No Book found" }));
});

//can be used to mark the book as read or to read for instance
router.put("/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

module.exports = router;
