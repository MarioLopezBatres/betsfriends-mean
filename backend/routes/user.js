const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

/**
 * Store a new user within an encypted password
 */
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const user = new User({
        imagePath: req.body.imagePath,
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save(result => {
        res.status(201).json({
            message: "User created",
            result: result
          })
          .catch(err => {
            res.status(500).json({
              error: err
            })
          });
      });
    })
});

module.exports = router;
