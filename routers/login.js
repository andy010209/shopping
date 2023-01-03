import express from "express";
import passport from "passport";
import cors from "cors";
import cookieSession from "cookie-session";
import "../passport.js";
import {login} from "../middleware/verifier.js"
const router = express.Router();

router.use(cors());

router.use(
  cookieSession({
    name: "my-session",
    keys: ["key1", "key2"],
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
};

router.use(passport.initialize());
router.use(passport.session());

router.get("/", (req, res) => res.send("You are not logged in!"));
router.get("/failed", (req, res) => res.send("You failed to login!"));
router.get("/good", isLoggedIn, (req, res) =>
  res.send(`Welcome ${req.user.displayName}`)
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/good");
  }
);

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

router.post("/mylogin",login);

export default router;