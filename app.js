require("dotenv").config();
require("./config/passport-setup");
const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");

//connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("connected to db");
  }
);

const app = express();

app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.sessionKey],
  })
);

//initialzed passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

const Port = process.env.Port || 3000;

app.listen(Port, () => {
  console.log("we are listening at port 300");
});
