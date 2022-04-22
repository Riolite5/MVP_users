const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  passwordHash: String,
  firstName: String,
  lastName: String,
  googleId: String,
  booksRead: Array, //books currently being read (willie working on this)

  //ids of books on the to readList
  toRead: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

// userSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;

//     delete returnedObject.passwordHash;
//   },
// });

module.exports = mongoose.model("User", userSchema);
