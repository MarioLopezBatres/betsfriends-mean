const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/users/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

/**
 * Store a new user within an encypted password
 */
router.post("/signup", multer({
  storage: storage
}).single("image"), (req, res, next) => {
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const url = req.protocol + "://" + req.get("host");
      const user = new User({
        imagePath: url + "/images/users/" + req.file.filename,
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save().then(result => {
        res.status(201).json({
          message: "User created",
          result: result
        });
      }).catch(err => {
        res.status(500).json({
          error: err
        });
      });;
    })
});

router.post("/login", (req, res, next) => {
  // IMPORTANT! PASS VARIABLE FROM ONE THEN TO ANOTHER
  let fetchedUser;
  // Exists email?
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      // User does not exist
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      // matches password?
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      // No match
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      // Matches
      const token = jwt.sign({
        userId: fetchedUser._id,
        imagePath: fetchedUser.imagePath,
        username: fetchedUser.username,
        email: fetchedUser.email
      }, '+HoF+Sj+lmRCo@ODssWDNlauB4SRkLl1dvooYCg8dslLlNlZfVnVFVoro2wGeIiZF38GBnJ5D8CdlTH02tIRCig==', {
        expiresIn: "1h"
      });
      // No need to return cause it is the last statement
      res.status(200).json({
        token: token
      });
    }).catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
