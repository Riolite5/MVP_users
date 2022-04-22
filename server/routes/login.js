const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (request, response) => {
  console.log("reached post login.....");
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  //generate a token for the user if user is nayce
  const userForToken = {
    username: username,
    id: user._id,
  };

  //expiry duration for the token in 10 minutes
  const token = jwt.sign(userForToken, process.env.JWT_KEY, {
    expiresIn: 60 * 10,
  });

  response.status(200).send({
    token,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

module.exports = loginRouter;
