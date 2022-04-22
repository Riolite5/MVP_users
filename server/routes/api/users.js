const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../../models/User");

usersRouter.post("/", async (request, response) => {
  const { username, firstname, lastname, password } = request.body;
  // check if received username is already taken
  console.log("~~~~~~~", username);
  const existingUser = await User.findOne({ userName: username });
  console.log("~~~~~~~", existingUser);

  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  //additional user validation criteria can be added here
  //such as username length, charecters used, etc.

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    userName: username,
    passwordHash: passwordHash,
    firstName: firstname,
    lastName: lastname,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.delete("/:id", async (request, response) => {
  const userToDelete = await User.findById(request.params.id);
  await User.findOneAndRemove(userToDelete);
});
module.exports = usersRouter;
