const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const betsRoutes = require("./routes/bets");

const app = express();

mongoose.connect("mongodb+srv://mariolopez:M0scqhqVsdEpLu5B@cluster0-ht50h.mongodb.net/betsfriends?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// request to /images are allowed
app.use("/images", express.static(path.join("backend/images")));

// Solve CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
})

app.use("/api/bets", betsRoutes);

module.exports = app;
