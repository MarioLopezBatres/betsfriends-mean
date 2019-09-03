const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
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
          message: "Invalid authentication credentials"
        });
      });;
    })
}

exports.userLogin = (req, res, next) => {
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
        token: token,
        expiresIn: 3600,
        // You can get it from token but decoding the token presents a worse performance
        userId: fetchedUser._id
      });
    }).catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
