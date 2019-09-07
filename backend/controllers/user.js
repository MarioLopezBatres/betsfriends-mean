const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const url = req.protocol + "://" + req.get("host");
      const user = new User({
        imagePath: url + "/images/users/" + req.file.filename,
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save().then(result => {
        const registrationMessage = `
            <h2> You have been successfully registered </h2>
            <p> Betsfriends wants to welcome you in our new social media. We hope you enjoy it! </p>

            <h3> User data </h3>
            <ul>
              <li> Name: ${req.body.fullname} </li>
              <li> Email: ${req.body.email} </li>
              <li> Username: ${req.body.username} </li>
            </ul>`;

        // CONFIRMATION EMAIL
        // create reusable transporter object using the default SMTP transport
        // Host is created in amazon SES
        let transporter = nodemailer.createTransport({
          host: 'email-smtp.eu-west-1.amazonaws.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.USER, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
          },
          // Allows to use it in localhost
          tls: {
            rejectUnauthorized: false
          }
        });

        // send mail with defined transport object
        let info = transporter.sendMail({
          from: 'betsfriends.media@gmail.com', // sender address
          to: req.body.email, // list of receivers
          subject: 'Wellcome to Betsfriends', // Subject line
          text: 'Betsfriends wants to welcome you in our new social media. We hope you enjoy it!', // plain text body
          html: registrationMessage // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        transporter.sendMail(info, function (err, data) {
          if (err) {
            console.log('Error Occurs');
          } else {
            console.log('Email sent!');
          }
        });

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
        fullname: fetchedUser.fullname,
        username: fetchedUser.username,
        email: fetchedUser.email
      }, process.env.JWT_KEY, {
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
