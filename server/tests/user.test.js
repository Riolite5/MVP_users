const bcrypt = require("bcrypt");
const { application } = require("express");
const User = require("../models/User");
const helper = require("./test_helper");

describe("when there is initially one user in db", () => {
  //populate DB with a single user
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "testUser", passwordHash });

    await user.save();
  });
  // post a new user to /api/users then check DB
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Riolite",
      firstname: "Tariq",
      lastname: "Kh",
      password: "isnayce",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
  test("creation fails if username already taken", async () => {
    const usersAtStart = helper.usersInDb();

    const newUser = {
      username: "testUser",
      password: "ismalayf",
      firstname: "X",
      lastname: "Y",
    };

    const result = api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});
