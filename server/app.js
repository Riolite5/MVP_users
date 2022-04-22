const express = require("express");
require("express-async-errors");

const connectDB = require("./config/db");
var cors = require("cors");
require("dotenv").config();

//routes
const booksRouter = require("./routes/api/books");
const usersRouter = require("./routes/api/users");
const loginRouter = require("./routes/login");
//middleware
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");

const app = express();

const passportSetup = require("./config/passport-setup");

// Connect Database
connectDB();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

//cors
app.use(cors({ origin: true, credentials: true }));

// init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Hello world!!!!!!"));

// use Routes
app.use("/api/books", booksRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

//use middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
//listen
const port = process.env.PORT || 8002;
app.listen(port, () => console.log(`server is running on port ${port}`));
