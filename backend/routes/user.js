const express = require("express");
const UserController = require("../controllers/user")
const router = express.Router();

const multer = require("multer");


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
}).single("image"), UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
