const router = require("express").Router();
const passport = require("passport");

//auth login
router.get("/login", (request, response) => {
  response.render("login");
});

router.get("/logout", (request, response) => {
  request.logout();
  response.redirect("/");
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  (request, response) => {
    response.redirect("http://localhost:3000/");
  }
);
module.exports = router;
