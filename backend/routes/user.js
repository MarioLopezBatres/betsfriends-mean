const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");

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
    cb(error, "backend/images/users");
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
        imagePath: url + "/images/users" + req.file.filename,
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save(result => {
        res.status(201).json({
          message: "User created",
          result: result
        })
      }).catch(err => {
        res.status(500).json({
          error: err
        })
      });;
    })
});

module.exports = router;
